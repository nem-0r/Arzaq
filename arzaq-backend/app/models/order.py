# app/models/order.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class OrderStatus(str, enum.Enum):
    """Order status"""
    PENDING = "pending"  # Order created, awaiting payment
    PAID = "paid"  # Payment successful
    CONFIRMED = "confirmed"  # Restaurant confirmed
    READY = "ready"  # Ready for pickup
    COMPLETED = "completed"  # Picked up by customer
    CANCELLED = "cancelled"  # Cancelled or expired


class Order(Base):
    """Order model"""

    __tablename__ = "orders"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # User & Status
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)

    # Pricing
    subtotal = Column(Float, nullable=False)  # Sum of all items (what client pays)
    platform_fee = Column(Float, nullable=False)  # 10% platform fee (deducted from restaurant, NOT added to client payment)
    total = Column(Float, nullable=False)  # = subtotal (client pays ONLY food price, NO extra fee)

    # Pickup
    pickup_code = Column(String(50), unique=True, nullable=True)  # QR code data
    qr_code_path = Column(String(500), nullable=True)  # Path to QR code image

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)

    def __repr__(self):
        return f"<Order(id={self.id}, user_id={self.user_id}, status='{self.status}', total={self.total})>"

    @property
    def restaurant_ids(self) -> list:
        """Get unique restaurant IDs from order items"""
        return list(set(item.food.restaurant_id for item in self.items))


class OrderItem(Base):
    """Order item model - individual food items in an order"""

    __tablename__ = "order_items"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id", ondelete="RESTRICT"), nullable=False)

    # Item Details (snapshot at time of order)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price per item at time of order
    subtotal = Column(Float, nullable=False)  # quantity * price

    # Restaurant fee split
    restaurant_amount = Column(Float, nullable=False)  # 90% goes to restaurant
    platform_amount = Column(Float, nullable=False)  # 10% goes to platform

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    order = relationship("Order", back_populates="items")
    food = relationship("Food", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem(id={self.id}, order_id={self.order_id}, food_id={self.food_id}, quantity={self.quantity})>"
