# app/routers/comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate

router = APIRouter()


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all comments for a post

    - Returns comments ordered by newest first
    - Includes author information
    """
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    comments = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())  # Oldest first (like typical comment threads)
        .all()
    )

    # Build response with author info
    result = []
    for comment in comments:
        comment_dict = {
            "id": comment.id,
            "user_id": comment.user_id,
            "post_id": comment.post_id,
            "text": comment.text,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "author_name": comment.author.full_name if comment.author else None,
            "author_email": comment.author.email if comment.author else None,
        }
        result.append(comment_dict)

    return result


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a comment on a post

    - Requires authentication
    - User must be logged in to comment
    """
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Create comment
    new_comment = Comment(
        user_id=current_user.id,
        post_id=post_id,
        text=comment_data.text
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Build response
    response = {
        "id": new_comment.id,
        "user_id": new_comment.user_id,
        "post_id": new_comment.post_id,
        "text": new_comment.text,
        "created_at": new_comment.created_at,
        "updated_at": new_comment.updated_at,
        "author_name": current_user.full_name,
        "author_email": current_user.email,
    }

    return response


@router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a comment

    - Requires authentication
    - Only comment author can update
    """
    comment = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.id == comment_id)
        .first()
    )

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Check ownership
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own comments"
        )

    # Update comment
    comment.text = comment_data.text
    db.commit()
    db.refresh(comment)

    response = {
        "id": comment.id,
        "user_id": comment.user_id,
        "post_id": comment.post_id,
        "text": comment.text,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "author_name": comment.author.full_name if comment.author else None,
        "author_email": comment.author.email if comment.author else None,
    }

    return response


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a comment

    - Requires authentication
    - Only comment author can delete
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    # Check ownership
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments"
        )

    db.delete(comment)
    db.commit()

    return None
