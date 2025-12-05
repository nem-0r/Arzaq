# app/schemas/notification.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.notification import NotificationType


class NotificationBase(BaseModel):
    """Base notification schema"""
    type: NotificationType
    title: str = Field(..., max_length=255)
    message: str


class NotificationCreate(NotificationBase):
    """Schema for creating a notification"""
    user_id: int
    related_id: Optional[int] = None
    related_type: Optional[str] = Field(None, max_length=50)


class NotificationResponse(NotificationBase):
    """Schema for notification response"""
    id: int
    user_id: int
    is_read: bool
    related_id: Optional[int] = None
    related_type: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationMarkRead(BaseModel):
    """Schema for marking notification as read"""
    is_read: bool = True
