# app/schemas/payment.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    """Schema for initiating a payment"""
    order_id: int


class PaymentResponse(BaseModel):
    """Schema for payment response"""
    id: int
    order_id: int
    user_id: int
    payment_method: str
    status: str
    amount: float
    paybox_payment_id: Optional[str]
    created_at: datetime
    paid_at: Optional[datetime]

    class Config:
        from_attributes = True


class PayBoxInitiateResponse(BaseModel):
    """Response from PayBox payment initiation"""
    payment_url: str  # URL to redirect user for payment
    payment_id: str  # PayBox payment ID


class PayBoxCallbackRequest(BaseModel):
    """
    Schema for PayBox callback/webhook

    PayBox sends this data when payment is complete
    """
    pg_order_id: str  # Our order ID
    pg_payment_id: str  # PayBox payment ID
    pg_amount: str  # Amount paid
    pg_currency: str  # Currency (KZT)
    pg_net_amount: Optional[str]  # Amount after fees
    pg_ps_amount: Optional[str]  # Payment system amount
    pg_ps_full_amount: Optional[str]
    pg_ps_currency: Optional[str]
    pg_description: Optional[str]
    pg_result: str  # 1 = success, 0 = failure
    pg_payment_date: Optional[str]
    pg_can_reject: Optional[str]
    pg_user_phone: Optional[str]
    pg_user_contact_email: Optional[str]
    pg_user_ip: Optional[str]
    pg_captured: Optional[str]
    pg_sig: str  # Signature for verification
    pg_salt: Optional[str]
