# app/routers/orders.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
import qrcode
import os

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus
from app.models.food import Food
from app.models.reservation import Reservation, ReservationStatus
from app.models.user_impact import UserImpact
from app.models.notification import Notification, NotificationType
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter()


def generate_qr_code(pickup_code: str) -> str:
    """
    Generate QR code for order pickup

    Args:
        pickup_code: Unique pickup code

    Returns:
        Path to QR code image
    """
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(pickup_code)
    qr.make(fit=True)

    # Generate image
    img = qr.make_image(fill_color="black", back_color="white")

    # Save to file
    filename = f"{pickup_code}.png"
    filepath = os.path.join(settings.QR_CODE_DIR, filename)
    img.save(filepath)

    return f"/uploads/qr_codes/{filename}"


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new order

    **Flow:**
    1. Validate all food items are available
    2. Create reservations (10-minute hold on inventory)
    3. Create order in PENDING status
    4. Return order details for payment

    **Note:** Order becomes PAID after successful payment via PayBox
    """
    # Validate and calculate order totals
    order_items_data = []
    subtotal = 0.0

    for item in order_data.items:
        # Get food item
        food = db.query(Food).filter(Food.id == item.food_id).first()

        if not food:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item with ID {item.food_id} not found"
            )

        # Check availability
        if not food.is_available or food.available_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Food item '{food.name}' is not available in requested quantity"
            )

        # Calculate item totals
        item_subtotal = food.price * item.quantity
        restaurant_amount = item_subtotal * 0.9  # 90% to restaurant
        platform_amount = item_subtotal * 0.1  # 10% platform fee

        order_items_data.append({
            "food": food,
            "quantity": item.quantity,
            "price": food.price,
            "subtotal": item_subtotal,
            "restaurant_amount": restaurant_amount,
            "platform_amount": platform_amount,
        })

        subtotal += item_subtotal

    # Calculate platform fee
    platform_fee = subtotal * (settings.PLATFORM_FEE_PERCENTAGE / 100)
    total = subtotal + platform_fee

    # Create order
    new_order = Order(
        user_id=current_user.id,
        status=OrderStatus.PENDING,
        subtotal=subtotal,
        platform_fee=platform_fee,
        total=total,
        notes=order_data.notes,
    )

    db.add(new_order)
    db.flush()  # Get order ID without committing

    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=new_order.id,
            food_id=item_data["food"].id,
            quantity=item_data["quantity"],
            price=item_data["price"],
            subtotal=item_data["subtotal"],
            restaurant_amount=item_data["restaurant_amount"],
            platform_amount=item_data["platform_amount"],
        )
        db.add(order_item)

    # Create reservations (10-minute hold)
    for item in order_data.items:
        reservation = Reservation(
            user_id=current_user.id,
            food_id=item.food_id,
            quantity=item.quantity,
            status=ReservationStatus.ACTIVE,
            expires_at=Reservation.create_expiration_time(settings.RESERVATION_TIMEOUT_MINUTES),
        )
        db.add(reservation)

    db.commit()
    db.refresh(new_order)

    # Build response with item details
    new_order.items = [
        OrderItemResponse(
            id=item.id,
            food_id=item.food_id,
            food_name=item.food.name,
            quantity=item.quantity,
            price=item.price,
            subtotal=item.subtotal,
            restaurant_amount=item.restaurant_amount,
            platform_amount=item.platform_amount,
        )
        for item in new_order.items
    ]

    return new_order


@router.get("/", response_model=List[OrderResponse])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's orders

    Returns all orders for the authenticated user
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()

    # Add food names to items
    for order in orders:
        for item in order.items:
            item.food_name = item.food.name

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order details by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Check ownership
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )

    # Add food names
    for item in order.items:
        item.food_name = item.food.name

    return order


@router.post("/{order_id}/confirm", response_model=OrderResponse)
async def confirm_order_payment(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm order after successful payment

    **This is called by PayBox webhook after payment success**

    Actions:
    1. Update order status to PAID
    2. Convert reservations to CONFIRMED
    3. Deduct quantity from food items
    4. Generate QR code for pickup
    """
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Update order status
    order.status = OrderStatus.PAID
    order.paid_at = datetime.utcnow()

    # Generate pickup code and QR code
    pickup_code = f"ARZAQ-{order.id}-{uuid.uuid4().hex[:8].upper()}"
    order.pickup_code = pickup_code
    order.qr_code_path = generate_qr_code(pickup_code)

    # Confirm reservations and deduct inventory
    reservations = db.query(Reservation).filter(
        Reservation.user_id == current_user.id,
        Reservation.status == ReservationStatus.ACTIVE
    ).all()

    for reservation in reservations:
        # Mark reservation as confirmed
        reservation.status = ReservationStatus.CONFIRMED

        # Deduct from food quantity
        food = db.query(Food).filter(Food.id == reservation.food_id).first()
        if food:
            food.quantity -= reservation.quantity

    # Create notification for user
    notification = Notification(
        user_id=order.user_id,
        type=NotificationType.ORDER_CONFIRMED,
        title="Payment Successful!",
        message=f"Your order #{order.id} has been confirmed. Use the pickup code to collect your order.",
        related_id=order.id,
        related_type="order"
    )
    db.add(notification)

    # Get restaurant IDs from order items and notify them
    restaurant_ids = set()
    for item in order.items:
        if item.food.restaurant_id:
            restaurant_ids.add(item.food.restaurant_id)

    for restaurant_id in restaurant_ids:
        restaurant_notification = Notification(
            user_id=restaurant_id,
            type=NotificationType.ORDER_CREATED,
            title="New Order Received",
            message=f"You have a new order #{order.id}. Please prepare it for pickup.",
            related_id=order.id,
            related_type="order"
        )
        db.add(restaurant_notification)

    db.commit()
    db.refresh(order)

    # Add food names
    for item in order.items:
        item.food_name = item.food.name

    return order


@router.get("/{order_id}/qr", response_model=dict)
async def get_order_qr_code(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get QR code for order pickup

    Returns QR code image URL and pickup code
    """
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Check ownership
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )

    if not order.pickup_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order not paid yet. QR code will be available after payment."
        )

    return {
        "pickup_code": order.pickup_code,
        "qr_code_url": order.qr_code_path,
    }


@router.put("/{order_id}/complete", response_model=OrderResponse)
async def complete_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark order as completed (picked up)

    Can be called by restaurant or user
    """
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    order.status = OrderStatus.COMPLETED
    order.completed_at = datetime.utcnow()

    # Update user impact statistics
    total_meals = sum(item.quantity for item in order.items)

    # Get or create user impact
    user_impact = db.query(UserImpact).filter(UserImpact.user_id == order.user_id).first()
    if not user_impact:
        user_impact = UserImpact(user_id=order.user_id)
        db.add(user_impact)

    # Add impact from this order
    user_impact.add_meal_impact(total_meals)

    # Create completion notification for user
    notification = Notification(
        user_id=order.user_id,
        type=NotificationType.ORDER_COMPLETED,
        title="Order Completed!",
        message=f"Thank you for rescuing {total_meals} meal(s)! You've saved {total_meals * 0.18:.1f}kg of CO2.",
        related_id=order.id,
        related_type="order"
    )
    db.add(notification)

    # Get restaurant IDs from order items
    restaurant_ids = set()
    for item in order.items:
        if item.food.restaurant_id:
            restaurant_ids.add(item.food.restaurant_id)

    # Create notification for each restaurant
    for restaurant_id in restaurant_ids:
        restaurant_notification = Notification(
            user_id=restaurant_id,
            type=NotificationType.ORDER_COMPLETED,
            title="Order Picked Up",
            message=f"Order #{order.id} has been successfully picked up by the customer.",
            related_id=order.id,
            related_type="order"
        )
        db.add(restaurant_notification)

    db.commit()
    db.refresh(order)

    # Add food names
    for item in order.items:
        item.food_name = item.food.name

    return order
