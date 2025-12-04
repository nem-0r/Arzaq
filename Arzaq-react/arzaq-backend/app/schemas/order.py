# app/schemas/order.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class OrderItemCreate(BaseModel):
    """Schema for creating an order item"""
    food_id: int
    quantity: int = Field(..., ge=1, description="Quantity to order")


class OrderCreate(BaseModel):
    """Schema for creating an order"""
    items: List[OrderItemCreate] = Field(..., min_items=1)
    notes: Optional[str] = Field(None, max_length=500)


class OrderItemResponse(BaseModel):
    """Schema for order item response"""
    id: int
    food_id: int
    food_name: str  # Computed field
    quantity: int
    price: float  # Price at time of order
    subtotal: float
    restaurant_amount: float
    platform_amount: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """Schema for order response"""
    id: int
    user_id: int
    status: str
    subtotal: float
    platform_fee: float
    total: float
    pickup_code: Optional[str]
    qr_code_path: Optional[str]
    notes: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime]
    paid_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Schema for paginated order list"""
    items: List[OrderResponse]
    total: int
    page: int
    page_size: int
    pages: int
