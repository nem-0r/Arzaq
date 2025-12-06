# app/schemas/post.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PostBase(BaseModel):
    """Base post schema"""
    title: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., min_length=1, max_length=5000)
    restaurant_id: Optional[int] = None
    image: Optional[str] = None
    is_public: bool = True


class PostCreate(PostBase):
    """Schema for creating a post"""
    pass


class PostUpdate(BaseModel):
    """Schema for updating a post"""
    title: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    restaurant_id: Optional[int] = None
    image: Optional[str] = None
    is_public: Optional[bool] = None


class CommentBase(BaseModel):
    """Base comment schema"""
    content: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    """Schema for creating a comment"""
    pass


class CommentUpdate(BaseModel):
    """Schema for updating a comment"""
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(CommentBase):
    """Schema for comment response"""
    id: int
    post_id: int
    user_id: int
    user_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LikeResponse(BaseModel):
    """Schema for like response"""
    id: int
    post_id: int
    user_id: int
    user_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PostResponse(PostBase):
    """Schema for post response"""
    id: int
    user_id: int
    user_name: Optional[str] = None
    restaurant_name: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    created_at: datetime
    updated_at: datetime
    comments: Optional[List[CommentResponse]] = []

    class Config:
        from_attributes = True
