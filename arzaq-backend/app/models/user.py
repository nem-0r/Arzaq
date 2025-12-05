# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    """User roles"""
    CLIENT = "client"
    RESTAURANT = "restaurant"
    ADMIN = "admin"


class User(Base):
    """User model - handles both clients and restaurants"""

    __tablename__ = "users"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Nullable for OAuth users
    full_name = Column(String(255), nullable=False)

    # OAuth
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    supabase_id = Column(String(255), unique=True, nullable=True, index=True)

    # Role & Status
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)  # For restaurant approval by admin

    # Restaurant-specific fields
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    description = Column(String(1000), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rating = Column(Float, nullable=True, default=0.0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    foods = relationship("Food", back_populates="restaurant", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    payments_made = relationship("Payment", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"

    @property
    def is_restaurant(self) -> bool:
        """Check if user is a restaurant"""
        return self.role == UserRole.RESTAURANT

    @property
    def is_client(self) -> bool:
        """Check if user is a client"""
        return self.role == UserRole.CLIENT

    @property
    def is_admin(self) -> bool:
        """Check if user is an admin"""
        return self.role == UserRole.ADMIN
