# app/schemas/food.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


class FoodBase(BaseModel):
    """Base food schema"""
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    price: float = Field(..., gt=0, description="Price in Tenge")
    old_price: Optional[float] = Field(None, gt=0, description="Original price for discount")
    quantity: int = Field(..., ge=0, description="Total portions available")
    expires_at: Optional[datetime] = Field(None, description="Pickup deadline")

    @validator("old_price")
    def validate_old_price(cls, v, values):
        """Ensure old_price is greater than price"""
        if v is not None and "price" in values and v <= values["price"]:
            raise ValueError("old_price must be greater than price")
        return v


class FoodCreate(FoodBase):
    """Schema for creating a food item"""
    image: Optional[str] = None  # Will be set after image upload


class FoodUpdate(BaseModel):
    """Schema for updating a food item"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    old_price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)
    is_available: Optional[bool] = None
    expires_at: Optional[datetime] = None
    image: Optional[str] = None


class FoodResponse(BaseModel):
    """Schema for food item response"""
    id: int
    name: str
    description: Optional[str]
    image: Optional[str]
    price: float
    old_price: Optional[float]
    discount: Optional[int]
    quantity: int
    is_available: bool
    expires_at: Optional[datetime]
    restaurant_id: int
    restaurant_name: str  # Computed field
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class FoodListResponse(BaseModel):
    """Schema for paginated food list"""
    items: List[FoodResponse]
    total: int
    page: int
    page_size: int
    pages: int
