# app/models/post.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Post(Base):
    """
    Post model for community sharing
    Users can create posts about restaurants they visited
    """
    __tablename__ = "posts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Content
    text = Column(Text, nullable=False)  # Post content
    image_url = Column(String(500), nullable=True)  # Optional image
    location = Column(String(255), nullable=True)  # Restaurant address

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", foreign_keys=[user_id], backref="posts")
    restaurant = relationship("User", foreign_keys=[restaurant_id])

    def __repr__(self):
        return f"<Post(id={self.id}, author_id={self.user_id}, restaurant_id={self.restaurant_id})>"
