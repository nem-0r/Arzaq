# app/schemas/comment.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CommentBase(BaseModel):
    """Base comment schema"""
    text: str = Field(..., min_length=1, max_length=2000)


class CommentCreate(CommentBase):
    """Schema for creating a comment"""
    pass


class CommentUpdate(BaseModel):
    """Schema for updating a comment"""
    text: str = Field(..., min_length=1, max_length=2000)


class CommentResponse(CommentBase):
    """Schema for comment response"""
    id: int
    user_id: int
    post_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Author info (populated from relationship)
    author_name: Optional[str] = None
    author_email: Optional[str] = None

    class Config:
        from_attributes = True
