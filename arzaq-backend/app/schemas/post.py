# app/schemas/post.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    """Base post schema"""
    text: str = Field(..., min_length=10, max_length=5000)
    restaurant_id: Optional[int] = None
    location: Optional[str] = Field(None, max_length=255)


class PostCreate(PostBase):
    """Schema for creating a post"""
    image_url: Optional[str] = Field(None, max_length=500)


class PostUpdate(BaseModel):
    """Schema for updating a post"""
    text: Optional[str] = Field(None, min_length=10, max_length=5000)
    image_url: Optional[str] = Field(None, max_length=500)


class PostResponse(PostBase):
    """Schema for post response"""
    id: int
    user_id: int
    image_url: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Author info (will be populated from relationship)
    author_name: Optional[str] = None
    author_email: Optional[str] = None

    class Config:
        from_attributes = True


class PostWithDetails(PostResponse):
    """Extended post response with author and restaurant details"""
    restaurant_name: Optional[str] = None
    restaurant_address: Optional[str] = None

    class Config:
        from_attributes = True
