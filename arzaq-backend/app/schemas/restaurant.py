# app/schemas/restaurant.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class RestaurantProfileBase(BaseModel):
    """Base restaurant profile schema"""
    name: str = Field(..., min_length=2, max_length=255, description="Restaurant business name")
    description: Optional[str] = Field(None, max_length=2000, description="About the restaurant")
    address: str = Field(..., min_length=5, max_length=500, description="Restaurant address")
    phone: Optional[str] = Field(None, max_length=50, description="Contact phone number")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")


class RestaurantProfileCreate(RestaurantProfileBase):
    """Schema for creating a restaurant profile"""
    logo: Optional[str] = Field(None, max_length=500, description="Logo image URL")
    cover_image: Optional[str] = Field(None, max_length=500, description="Cover image URL")


class RestaurantProfileUpdate(BaseModel):
    """Schema for updating a restaurant profile"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    address: Optional[str] = Field(None, min_length=5, max_length=500)
    phone: Optional[str] = Field(None, max_length=50)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    logo: Optional[str] = Field(None, max_length=500)
    cover_image: Optional[str] = Field(None, max_length=500)


class RestaurantProfileResponse(RestaurantProfileBase):
    """Schema for restaurant profile response"""
    id: int
    user_id: int
    logo: Optional[str] = None
    cover_image: Optional[str] = None
    rating: float
    status: str  # pending, approved, rejected
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2


class RestaurantProfileWithUser(RestaurantProfileResponse):
    """Restaurant profile with user information"""
    user_email: Optional[str] = None
    user_full_name: Optional[str] = None

    class Config:
        from_attributes = True


class RestaurantApproval(BaseModel):
    """Schema for approving/rejecting a restaurant"""
    action: str = Field(..., pattern="^(approve|reject)$")
    rejection_reason: Optional[str] = Field(None, max_length=500)

    @validator("rejection_reason")
    def validate_rejection_reason(cls, v, values):
        """Ensure rejection_reason is provided when action is reject"""
        if values.get("action") == "reject" and not v:
            raise ValueError("Rejection reason is required when rejecting a restaurant")
        return v
