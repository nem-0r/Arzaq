# app/models/food.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Food(Base):
    """Food item model"""

    __tablename__ = "foods"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)  # URL or path to image

    # Pricing
    price = Column(Float, nullable=False)  # Current price in Tenge
    old_price = Column(Float, nullable=True)  # Original price for discount display
    discount = Column(Integer, nullable=True)  # Discount percentage (calculated)

    # Inventory
    quantity = Column(Integer, nullable=False, default=0)  # Total portions created
    # Note: available_quantity is calculated as (quantity - reserved_count)

    # Availability
    is_available = Column(Boolean, default=True)  # Manual override for availability
    expires_at = Column(DateTime(timezone=True), nullable=True)  # Pickup deadline

    # Foreign Keys
    restaurant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # Legacy - for backwards compatibility
    restaurant_profile_id = Column(Integer, ForeignKey("restaurant_profiles.id", ondelete="CASCADE"), nullable=True)  # New relation

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    restaurant = relationship("User", back_populates="foods")
    restaurant_profile = relationship("RestaurantProfile", back_populates="foods")
    order_items = relationship("OrderItem", back_populates="food")
    reservations = relationship("Reservation", back_populates="food")

    def __repr__(self):
        return f"<Food(id={self.id}, name='{self.name}', price={self.price})>"

    @property
    def available_quantity(self) -> int:
        """
        Calculate available quantity after reservations
        Returns: quantity - sum of active reservations
        """
        from app.models.reservation import Reservation
        from datetime import datetime

        # Sum active (non-expired) reservations
        reserved = sum(
            r.quantity
            for r in self.reservations
            if r.expires_at > datetime.utcnow() and r.status == "active"
        )

        return max(0, self.quantity - reserved)

    @property
    def is_in_stock(self) -> bool:
        """Check if food item is in stock"""
        return self.available_quantity > 0 and self.is_available

    def calculate_discount(self):
        """Calculate discount percentage from old_price and price"""
        if self.old_price and self.old_price > self.price:
            self.discount = int(((self.old_price - self.price) / self.old_price) * 100)
        else:
            self.discount = None
