# app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    CommentCreate,
    CommentUpdate,
    CommentResponse,
    LikeResponse
)

router = APIRouter()


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new post

    - Requires authentication
    - Optional restaurant tagging
    - Image URL can be provided
    """
    new_post = Post(
        user_id=current_user.id,
        title=post_data.title,
        content=post_data.content,
        restaurant_id=post_data.restaurant_id,
        image=post_data.image,
        is_public=post_data.is_public,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Add computed fields for response
    new_post.user_name = current_user.full_name
    new_post.restaurant_name = new_post.restaurant.full_name if new_post.restaurant else None
    new_post.likes_count = 0
    new_post.comments_count = 0
    new_post.is_liked = False
    new_post.comments = []

    return new_post


@router.get("/", response_model=List[PostResponse])
async def get_all_posts(
    skip: int = 0,
    limit: int = 20,
    current_user: Optional[User] = None,
    db: Session = Depends(get_db)
):
    """
    Get all posts

    - **skip**: Pagination offset
    - **limit**: Number of posts to return
    - Public posts visible to all
    - Private posts only to authenticated users
    """
    query = db.query(Post).filter(Post.is_public == True)

    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    # Add computed fields
    for post in posts:
        post.user_name = post.user.full_name
        post.restaurant_name = post.restaurant.full_name if post.restaurant else None
        post.likes_count = len(post.likes)
        post.comments_count = len(post.comments)
        post.is_liked = False

        # Check if current user liked this post
        if current_user:
            post.is_liked = any(like.user_id == current_user.id for like in post.likes)

        # Add comment details
        for comment in post.comments:
            comment.user_name = comment.user.full_name

    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post_by_id(
    post_id: int,
    current_user: Optional[User] = None,
    db: Session = Depends(get_db)
):
    """Get post by ID with full details"""
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Add computed fields
    post.user_name = post.user.full_name
    post.restaurant_name = post.restaurant.full_name if post.restaurant else None
    post.likes_count = len(post.likes)
    post.comments_count = len(post.comments)
    post.is_liked = False

    if current_user:
        post.is_liked = any(like.user_id == current_user.id for like in post.likes)

    # Add comment details
    for comment in post.comments:
        comment.user_name = comment.user.full_name

    return post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a post

    - Can only update own posts
    """
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )

    # Update fields
    update_data = post_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)

    # Add computed fields
    post.user_name = current_user.full_name
    post.restaurant_name = post.restaurant.full_name if post.restaurant else None
    post.likes_count = len(post.likes)
    post.comments_count = len(post.comments)
    post.is_liked = any(like.user_id == current_user.id for like in post.likes)

    # Add comment details
    for comment in post.comments:
        comment.user_name = comment.user.full_name

    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a post

    - Can only delete own posts
    """
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )

    db.delete(post)
    db.commit()

    return None


@router.post("/{post_id}/like", response_model=dict)
async def toggle_like(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle like on a post

    - Returns whether post is now liked and total likes count
    """
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if user already liked
    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        is_liked = False
    else:
        # Like
        new_like = Like(
            post_id=post_id,
            user_id=current_user.id
        )
        db.add(new_like)
        db.commit()
        is_liked = True

    # Get updated count
    likes_count = db.query(Like).filter(Like.post_id == post_id).count()

    return {
        "is_liked": is_liked,
        "likes_count": likes_count
    }


@router.get("/{post_id}/likes", response_model=List[LikeResponse])
async def get_post_likes(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get all likes for a post"""
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    likes = db.query(Like).filter(Like.post_id == post_id).all()

    # Add user names
    for like in likes:
        like.user_name = like.user.full_name

    return likes


@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get all comments for a post"""
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()

    # Add user names
    for comment in comments:
        comment.user_name = comment.user.full_name

    return comments


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new comment on a post"""
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_data.content
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Add user name
    new_comment.user_name = current_user.full_name

    return new_comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a comment (owner only)"""
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
            detail="Not authorized to delete this comment"
        )

    db.delete(comment)
    db.commit()

    return None
