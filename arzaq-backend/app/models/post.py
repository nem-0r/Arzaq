# app/models/post.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Post(Base):
    """Post model for community posts"""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    image = Column(String(1000), nullable=True)  # Image URL
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="posts")
    restaurant = relationship("User", foreign_keys=[restaurant_id])
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")

    @property
    def likes_count(self):
        """Get total number of likes"""
        return len(self.likes)

    @property
    def comments_count(self):
        """Get total number of comments"""
        return len(self.comments)
