# app/models/payment.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class PaymentStatus(str, enum.Enum):
    """Payment status"""
    PENDING = "pending"  # Initiated, awaiting PayBox
    SUCCESS = "success"  # Payment successful
    FAILED = "failed"  # Payment failed
    REFUNDED = "refunded"  # Refunded


class PaymentMethod(str, enum.Enum):
    """Payment method"""
    PAYBOX = "paybox"  # PayBox Kazakhstan
    CASH = "cash"  # Cash on pickup (if we add this later)


class Payment(Base):
    """Payment model - tracks all payments through PayBox"""

    __tablename__ = "payments"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Payment Details
    payment_method = Column(Enum(PaymentMethod), nullable=False, default=PaymentMethod.PAYBOX)
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)

    # Amounts in Tenge
    amount = Column(Float, nullable=False)  # Total amount charged

    # PayBox specific fields
    paybox_payment_id = Column(String(255), unique=True, nullable=True, index=True)
    paybox_transaction_id = Column(String(255), nullable=True)
    paybox_signature = Column(String(500), nullable=True)

    # Response data from PayBox
    paybox_response = Column(Text, nullable=True)  # JSON response from PayBox

    # Metadata
    failure_reason = Column(String(500), nullable=True)
    refund_reason = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="payment")
    user = relationship("User", back_populates="payments_made")

    def __repr__(self):
        return f"<Payment(id={self.id}, order_id={self.order_id}, amount={self.amount}, status='{self.status}')>"
