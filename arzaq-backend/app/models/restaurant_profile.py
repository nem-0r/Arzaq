# app/models/restaurant_profile.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class RestaurantStatus(str, enum.Enum):
    """Restaurant profile approval status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class RestaurantProfile(Base):
    """Restaurant profile model - detailed information about restaurant"""

    __tablename__ = "restaurant_profiles"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key to User (one-to-one)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Restaurant Basic Info
    name = Column(String(255), nullable=False)  # Restaurant business name
    description = Column(Text, nullable=True)  # About the restaurant
    address = Column(String(500), nullable=False)
    phone = Column(String(50), nullable=True)

    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Images
    logo = Column(String(500), nullable=True)  # Logo image URL
    cover_image = Column(String(500), nullable=True)  # Cover/banner image URL

    # Rating
    rating = Column(Float, nullable=True, default=0.0)

    # Approval Status
    status = Column(Enum(RestaurantStatus), nullable=False, default=RestaurantStatus.PENDING)
    rejection_reason = Column(Text, nullable=True)  # Reason if rejected by admin

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)  # When approved by admin

    # Relationships
    user = relationship("User", back_populates="restaurant_profile", uselist=False)
    foods = relationship("Food", back_populates="restaurant_profile", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<RestaurantProfile(id={self.id}, name='{self.name}', status='{self.status}')>"

    @property
    def is_approved(self) -> bool:
        """Check if restaurant is approved"""
        return self.status == RestaurantStatus.APPROVED

    @property
    def is_pending(self) -> bool:
        """Check if restaurant is pending approval"""
        return self.status == RestaurantStatus.PENDING

    @property
    def is_rejected(self) -> bool:
        """Check if restaurant is rejected"""
        return self.status == RestaurantStatus.REJECTED
