# app/routers/payments.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import hashlib
import requests
from urllib.parse import urlencode
from typing import Dict

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.schemas.payment import PaymentCreate, PaymentResponse, PayBoxInitiateResponse, PayBoxCallbackRequest

router = APIRouter()


def generate_paybox_signature(params: Dict[str, str], secret_key: str) -> str:
    """
    Generate PayBox signature for request verification

    Args:
        params: Dictionary of parameters
        secret_key: PayBox secret key

    Returns:
        MD5 hash signature
    """
    # Sort parameters by key
    sorted_params = sorted(params.items())

    # Create signature string: param1;value1;param2;value2;...;secret_key
    sig_parts = []
    for key, value in sorted_params:
        if key != 'pg_sig':  # Exclude signature itself
            sig_parts.append(str(value))

    sig_parts.append(secret_key)
    sig_string = ';'.join(sig_parts)

    # Return MD5 hash
    return hashlib.md5(sig_string.encode('utf-8')).hexdigest()


@router.post("/initiate", response_model=PayBoxInitiateResponse)
async def initiate_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initiate PayBox payment for an order

    **Flow:**
    1. Validate order exists and belongs to user
    2. Create payment record
    3. Generate PayBox payment URL
    4. Return URL for user to complete payment

    **User is redirected to PayBox** to complete payment
    """
    # Get order
    order = db.query(Order).filter(Order.id == payment_data.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Check ownership
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to pay for this order"
        )

    # Check if already paid
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order is not in pending status"
        )

    # Create payment record
    payment = Payment(
        order_id=order.id,
        user_id=current_user.id,
        payment_method=PaymentMethod.PAYBOX,
        status=PaymentStatus.PENDING,
        amount=order.total,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Get restaurant from first order item (all items should be from same restaurant)
    restaurant = order.items[0].food.restaurant if order.items else None

    # Use restaurant's PayBox credentials if set, otherwise use default
    merchant_id = restaurant.paybox_merchant_id if restaurant and restaurant.paybox_merchant_id else settings.PAYBOX_MERCHANT_ID
    secret_key = restaurant.paybox_secret_key if restaurant and restaurant.paybox_secret_key else settings.PAYBOX_SECRET_KEY

    # Prepare PayBox request parameters
    params = {
        'pg_merchant_id': merchant_id,
        'pg_order_id': str(order.id),
        'pg_amount': str(int(order.total)),  # Amount in tenge (integer)
        'pg_description': f'Order #{order.id} - ARZAQ Food Rescue',
        'pg_currency': 'KZT',
        'pg_lifetime': '600',  # Payment lifetime in seconds (10 minutes)
        'pg_success_url': settings.PAYBOX_SUCCESS_URL,
        'pg_failure_url': settings.PAYBOX_FAILURE_URL,
        'pg_result_url': settings.PAYBOX_RESULT_URL,
        'pg_user_id': str(current_user.id),
        'pg_user_contact_email': current_user.email,
    }

    # Generate signature
    params['pg_sig'] = generate_paybox_signature(params, secret_key)

    # Build payment URL
    payment_url = f"{settings.PAYBOX_PAYMENT_URL}?{urlencode(params)}"

    # Update payment with PayBox ID
    payment.paybox_payment_id = f"ARZAQ-{order.id}-{payment.id}"

    db.commit()

    return {
        "payment_url": payment_url,
        "payment_id": str(payment.id)
    }


@router.post("/callback")
async def paybox_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    PayBox webhook callback

    **Called by PayBox after payment completion**

    **Flow:**
    1. Verify signature
    2. Update payment status
    3. Update order status
    4. Confirm reservations and deduct inventory
    5. Generate QR code
    """
    # Get form data
    form_data = await request.form()
    callback_data = dict(form_data)

    # Extract signature
    received_sig = callback_data.get('pg_sig')

    if not received_sig:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing signature"
        )

    # Verify signature
    params_for_sig = {k: v for k, v in callback_data.items() if k != 'pg_sig'}
    expected_sig = generate_paybox_signature(params_for_sig, settings.PAYBOX_SECRET_KEY)

    if received_sig != expected_sig:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )

    # Extract order ID
    order_id = int(callback_data.get('pg_order_id'))
    payment_result = callback_data.get('pg_result')  # '1' = success, '0' = failure

    # Get order and payment
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    payment = db.query(Payment).filter(Payment.order_id == order_id).first()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    # Update payment
    payment.paybox_transaction_id = callback_data.get('pg_payment_id')
    payment.paybox_response = str(callback_data)

    if payment_result == '1':
        # Payment successful
        from datetime import datetime

        payment.status = PaymentStatus.SUCCESS
        payment.paid_at = datetime.utcnow()

        # Call order confirmation endpoint logic
        # (This duplicates some logic from orders.py:confirm_order_payment)
        from app.routers.orders import generate_qr_code
        from app.models.reservation import Reservation, ReservationStatus
        from app.models.food import Food
        import uuid

        order.status = OrderStatus.PAID
        order.paid_at = datetime.utcnow()

        # Generate QR code
        pickup_code = f"ARZAQ-{order.id}-{uuid.uuid4().hex[:8].upper()}"
        order.pickup_code = pickup_code
        order.qr_code_path = generate_qr_code(pickup_code)

        # Confirm reservations
        reservations = db.query(Reservation).filter(
            Reservation.user_id == order.user_id,
            Reservation.status == ReservationStatus.ACTIVE
        ).all()

        for reservation in reservations:
            reservation.status = ReservationStatus.CONFIRMED
            food = db.query(Food).filter(Food.id == reservation.food_id).first()
            if food:
                food.quantity -= reservation.quantity

    else:
        # Payment failed
        payment.status = PaymentStatus.FAILED
        payment.failure_reason = callback_data.get('pg_failure_description', 'Payment failed')
        order.status = OrderStatus.CANCELLED

    db.commit()

    # Return success response to PayBox
    return {
        "pg_status": "ok",
        "pg_description": "Payment processed successfully"
    }


@router.get("/{order_id}", response_model=PaymentResponse)
async def get_payment_status(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get payment status for an order

    Returns payment details and status
    """
    payment = db.query(Payment).filter(Payment.order_id == order_id).first()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found for this order"
        )

    # Check ownership
    if payment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this payment"
        )

    return payment
