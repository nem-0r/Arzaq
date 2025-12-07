# app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostResponse

router = APIRouter()


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new post

    - **text**: Post content (min 10 chars, max 5000 chars)
    - **restaurant_id**: Optional restaurant ID
    - **location**: Optional location/address
    - **image_url**: Optional image URL
    """
    # Create post
    new_post = Post(
        text=post_data.text,
        restaurant_id=post_data.restaurant_id,
        location=post_data.location,
        image_url=post_data.image_url,
        user_id=current_user.id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Build response with author and restaurant info
    response = PostResponse.from_orm(new_post)
    response.author_name = current_user.full_name
    response.author_email = current_user.email

    if new_post.restaurant:
        response.restaurant_name = new_post.restaurant.full_name
        response.restaurant_address = new_post.restaurant.address

    return response


@router.get("/", response_model=List[PostResponse])
async def get_all_posts(
    skip: int = 0,
    limit: int = 50,
    restaurant_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all posts

    - **skip**: Pagination offset
    - **limit**: Number of posts to return (max 100)
    - **restaurant_id**: Filter by restaurant ID
    """
    query = db.query(Post)

    # Filter by restaurant if specified
    if restaurant_id:
        query = query.filter(Post.restaurant_id == restaurant_id)

    # Order by newest first
    query = query.order_by(Post.created_at.desc())

    # Pagination
    posts = query.offset(skip).limit(min(limit, 100)).all()

    # Build responses with author and restaurant info
    responses = []
    for post in posts:
        response = PostResponse.from_orm(post)
        response.author_name = post.author.full_name
        response.author_email = post.author.email

        if post.restaurant:
            response.restaurant_name = post.restaurant.full_name
            response.restaurant_address = post.restaurant.address

        responses.append(response)

    return responses


@router.get("/{post_id}", response_model=PostResponse)
async def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get post by ID"""
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Build response with author and restaurant info
    response = PostResponse.from_orm(post)
    response.author_name = post.author.full_name
    response.author_email = post.author.email

    if post.restaurant:
        response.restaurant_name = post.restaurant.full_name
        response.restaurant_address = post.restaurant.address

    return response


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update post (only author can update)

    - **text**: Updated post content
    - **image_url**: Updated image URL
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
    if post_data.text is not None:
        post.text = post_data.text
    if post_data.image_url is not None:
        post.image_url = post_data.image_url

    db.commit()
    db.refresh(post)

    # Build response
    response = PostResponse.from_orm(post)
    response.author_name = post.author.full_name
    response.author_email = post.author.email

    if post.restaurant:
        response.restaurant_name = post.restaurant.full_name
        response.restaurant_address = post.restaurant.address

    return response


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete post (only author can delete)
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


@router.post("/upload-image", response_model=dict)
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload image for post

    Returns image URL
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
        )

    # Create uploads/posts directory if not exists
    posts_upload_dir = os.path.join(settings.UPLOAD_DIR, "posts")
    os.makedirs(posts_upload_dir, exist_ok=True)

    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(posts_upload_dir, unique_filename)

    # Save file
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Return URL
    image_url = f"/uploads/posts/{unique_filename}"

    return {"url": image_url}
