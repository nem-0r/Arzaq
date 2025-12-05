# app/models/notification.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class NotificationType(str, enum.Enum):
    """Notification types"""
    ORDER_CREATED = "order_created"  # New order created
    ORDER_CONFIRMED = "order_confirmed"  # Restaurant confirmed order
    ORDER_READY = "order_ready"  # Order ready for pickup
    ORDER_COMPLETED = "order_completed"  # Order completed
    RESTAURANT_APPROVED = "restaurant_approved"  # Restaurant application approved
    RESTAURANT_REJECTED = "restaurant_rejected"  # Restaurant application rejected
    NEW_POST_LIKE = "new_post_like"  # Someone liked your post
    NEW_POST_COMMENT = "new_post_comment"  # Someone commented on your post
    SYSTEM = "system"  # System notifications


class Notification(Base):
    """
    Notification Model

    Stores user notifications for various events:
    - Order updates (for clients and restaurants)
    - Restaurant approval/rejection (for restaurant owners)
    - Post interactions (likes, comments)
    - System announcements
    """

    __tablename__ = "notifications"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Notification Details
    type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)

    # Status
    is_read = Column(Boolean, default=False, nullable=False, index=True)

    # Optional: Link to related entity
    related_id = Column(Integer, nullable=True)  # ID of order/post/etc
    related_type = Column(String(50), nullable=True)  # 'order', 'post', etc

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type='{self.type}', is_read={self.is_read})>"

    def mark_as_read(self):
        """Mark notification as read"""
        self.is_read = True
        self.read_at = func.now()
