# app/models/comment.py
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Comment(Base):
    """
    Comment Model

    Users can comment on community posts to engage with the community
    """

    __tablename__ = "comments"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Content
    text = Column(Text, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, user_id={self.user_id}, post_id={self.post_id})>"
