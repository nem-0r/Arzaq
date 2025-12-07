# app/schemas/post.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PostCreate(BaseModel):
    """Schema for creating a post"""
    text: str = Field(..., min_length=10, max_length=5000, description="Post content")
    restaurant_id: Optional[int] = Field(None, description="Restaurant ID if posting about a restaurant")
    location: Optional[str] = Field(None, max_length=255, description="Location/address")
    image_url: Optional[str] = Field(None, max_length=500, description="Image URL")


class PostUpdate(BaseModel):
    """Schema for updating a post"""
    text: Optional[str] = Field(None, min_length=10, max_length=5000)
    image_url: Optional[str] = Field(None, max_length=500)


class PostResponse(BaseModel):
    """Schema for post response"""
    id: int
    text: str
    image_url: Optional[str]
    location: Optional[str]
    user_id: int
    restaurant_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]

    # Author info (будем добавлять вручную в роутере)
    author_name: Optional[str] = None
    author_email: Optional[str] = None

    # Restaurant info (если post связан с рестораном)
    restaurant_name: Optional[str] = None
    restaurant_address: Optional[str] = None

    class Config:
        from_attributes = True
