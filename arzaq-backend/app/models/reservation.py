# app/models/reservation.py
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Enum, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from datetime import datetime, timedelta
import enum


class ReservationStatus(str, enum.Enum):
    """Reservation status"""
    ACTIVE = "active"  # Currently holding inventory
    CONFIRMED = "confirmed"  # Converted to order
    EXPIRED = "expired"  # Timeout reached, inventory released
    CANCELLED = "cancelled"  # User cancelled


class Reservation(Base):
    """
    Reservation model - holds food items for 10 minutes during checkout/payment

    This prevents overselling and ensures items are available during payment flow
    """

    __tablename__ = "reservations"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id", ondelete="CASCADE"), nullable=False)

    # Reservation Details
    quantity = Column(Integer, nullable=False)
    status = Column(Enum(ReservationStatus), nullable=False, default=ReservationStatus.ACTIVE)

    # Session tracking
    session_id = Column(String(255), nullable=True, index=True)  # For anonymous users

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)

    # Relationships
    food = relationship("Food", back_populates="reservations")

    def __repr__(self):
        return f"<Reservation(id={self.id}, food_id={self.food_id}, quantity={self.quantity}, status='{self.status}')>"

    @staticmethod
    def create_expiration_time(minutes: int = 10) -> datetime:
        """Create expiration timestamp"""
        return datetime.utcnow() + timedelta(minutes=minutes)

    @property
    def is_expired(self) -> bool:
        """Check if reservation has expired"""
        return datetime.utcnow() > self.expires_at

    @property
    def is_active(self) -> bool:
        """Check if reservation is still active"""
        return self.status == ReservationStatus.ACTIVE and not self.is_expired
