# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field(default="client", pattern="^(client|restaurant)$")

    # Restaurant-specific fields (required if role=restaurant)
    address: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=1000)

    @validator("address")
    def validate_restaurant_address(cls, v, values):
        """Ensure address is provided for restaurants"""
        if values.get("role") == "restaurant" and not v:
            raise ValueError("Address is required for restaurant registration")
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str  # OAuth2 uses 'username', but we accept email
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = Field(None, max_length=1000)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    is_approved: bool
    phone: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


class RestaurantResponse(UserResponse):
    """Extended schema for restaurant details"""
    # Inherits all fields from UserResponse
    # Can add restaurant-specific computed fields here
    pass


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"


class SupabaseAuthRequest(BaseModel):
    """Schema for Supabase OAuth authentication"""
    email: EmailStr
    full_name: str
    google_id: str
    supabase_token: str
    role: str = Field(default="client", pattern="^(client|restaurant)$")

    # Optional restaurant fields
    address: Optional[str] = None
    phone: Optional[str] = None

    @validator("address")
    def validate_restaurant_address(cls, v, values):
        """Ensure address is provided for restaurants"""
        if values.get("role") == "restaurant" and not v:
            raise ValueError("Address is required for restaurant role")
        return v
