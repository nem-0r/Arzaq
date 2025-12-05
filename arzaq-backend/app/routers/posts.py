# app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.like import Like
from app.schemas.post import PostCreate, PostResponse, PostWithDetails, PostUpdate

router = APIRouter()


@router.get("/", response_model=List[PostWithDetails])
async def get_all_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all community posts

    - **skip**: Pagination offset
    - **limit**: Number of posts to return (max 100)
    - Returns posts ordered by newest first
    """
    posts = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.restaurant))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(min(limit, 100))
        .all()
    )

    # Enrich posts with author and restaurant details
    result = []
    for post in posts:
        post_dict = {
            "id": post.id,
            "user_id": post.user_id,
            "restaurant_id": post.restaurant_id,
            "text": post.text,
            "image_url": post.image_url,
            "location": post.location,
            "likes_count": post.likes_count,
            "comments_count": post.comments_count,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author_name": post.author.full_name if post.author else None,
            "author_email": post.author.email if post.author else None,
            "restaurant_name": post.restaurant.restaurant_name if post.restaurant else None,
            "restaurant_address": post.restaurant.address if post.restaurant else None,
        }
        result.append(post_dict)

    return result


@router.post("/", response_model=PostWithDetails, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new community post

    - Requires authentication
    - User can share their food rescue experience
    - Optionally link to a restaurant
    """
    # Create new post
    new_post = Post(
        user_id=current_user.id,
        restaurant_id=post_data.restaurant_id,
        text=post_data.text,
        image_url=post_data.image_url,
        location=post_data.location,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Load relationships for response
    db.refresh(new_post, attribute_names=['author', 'restaurant'])

    # Build response
    response = {
        "id": new_post.id,
        "user_id": new_post.user_id,
        "restaurant_id": new_post.restaurant_id,
        "text": new_post.text,
        "image_url": new_post.image_url,
        "location": new_post.location,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": new_post.created_at,
        "updated_at": new_post.updated_at,
        "author_name": current_user.full_name,
        "author_email": current_user.email,
        "restaurant_name": new_post.restaurant.restaurant_name if new_post.restaurant else None,
        "restaurant_address": new_post.restaurant.address if new_post.restaurant else None,
    }

    return response


@router.get("/{post_id}", response_model=PostWithDetails)
async def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific post by ID"""
    post = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.restaurant))
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    response = {
        "id": post.id,
        "user_id": post.user_id,
        "restaurant_id": post.restaurant_id,
        "text": post.text,
        "image_url": post.image_url,
        "location": post.location,
        "likes_count": post.likes_count,
        "comments_count": post.comments_count,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "author_name": post.author.full_name if post.author else None,
        "author_email": post.author.email if post.author else None,
        "restaurant_name": post.restaurant.restaurant_name if post.restaurant else None,
        "restaurant_address": post.restaurant.address if post.restaurant else None,
    }

    return response


@router.put("/{post_id}", response_model=PostWithDetails)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a post

    - Requires authentication
    - Only post author can update
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
            detail="You can only update your own posts"
        )

    # Update fields
    if post_data.text is not None:
        post.text = post_data.text
    if post_data.image_url is not None:
        post.image_url = post_data.image_url

    db.commit()
    db.refresh(post, attribute_names=['author', 'restaurant'])

    response = {
        "id": post.id,
        "user_id": post.user_id,
        "restaurant_id": post.restaurant_id,
        "text": post.text,
        "image_url": post.image_url,
        "location": post.location,
        "likes_count": post.likes_count,
        "comments_count": post.comments_count,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "author_name": post.author.full_name if post.author else None,
        "author_email": post.author.email if post.author else None,
        "restaurant_name": post.restaurant.restaurant_name if post.restaurant else None,
        "restaurant_address": post.restaurant.address if post.restaurant else None,
    }

    return response


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a post

    - Requires authentication
    - Only post author can delete
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
            detail="You can only delete your own posts"
        )

    db.delete(post)
    db.commit()

    return None


@router.post("/{post_id}/like", status_code=status.HTTP_200_OK)
async def toggle_like(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle like on a post

    - Requires authentication
    - If already liked, removes the like
    - If not liked, adds a like
    - Returns new like status and count
    """
    # Check if post exists
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
            user_id=current_user.id,
            post_id=post_id
        )
        db.add(new_like)
        db.commit()
        is_liked = True

    # Get updated count
    likes_count = db.query(Like).filter(Like.post_id == post_id).count()

    return {
        "success": True,
        "is_liked": is_liked,
        "likes_count": likes_count,
        "post_id": post_id,
        "user_id": current_user.id
    }


@router.get("/{post_id}/likes")
async def get_post_likes(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all likes for a post

    - Returns list of user IDs who liked the post
    - Returns total likes count
    """
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    likes = db.query(Like).filter(Like.post_id == post_id).all()
    user_ids = [like.user_id for like in likes]

    return {
        "success": True,
        "post_id": post_id,
        "likes_count": len(user_ids),
        "user_ids": user_ids
    }
