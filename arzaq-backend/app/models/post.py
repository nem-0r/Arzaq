# app/models/post.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Post(Base):
    """
    Community Post Model

    Users can share their food rescue experiences at restaurants
    """

    __tablename__ = "posts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    restaurant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)

    # Content
    text = Column(Text, nullable=False)  # Post text content
    image_url = Column(String(500), nullable=True)  # URL to uploaded image
    location = Column(String(255), nullable=True)  # Restaurant name/location string

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", foreign_keys=[user_id], back_populates="posts")
    restaurant = relationship("User", foreign_keys=[restaurant_id])
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Post(id={self.id}, user_id={self.user_id}, restaurant_id={self.restaurant_id})>"

    @property
    def likes_count(self) -> int:
        """Get total number of likes"""
        return len(self.likes)

    @property
    def comments_count(self) -> int:
        """Get total number of comments"""
        return len(self.comments)
