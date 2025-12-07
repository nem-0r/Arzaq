# app/routers/foods.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user, get_current_restaurant
from app.core.config import settings
from app.models.user import User
from app.models.food import Food
from app.models.restaurant_profile import RestaurantProfile, RestaurantStatus
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse

router = APIRouter()


# Dependency to get approved restaurant profile
async def get_current_approved_restaurant_profile(
    current_user: User = Depends(get_current_restaurant),
    db: Session = Depends(get_db)
) -> RestaurantProfile:
    """Get current approved restaurant profile"""
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found. Please create your restaurant profile first."
        )

    if profile.status != RestaurantStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Restaurant profile is {profile.status.value}. You need admin approval to create food items."
        )

    return profile


def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save uploaded file and return its path

    Args:
        upload_file: FastAPI UploadFile

    Returns:
        Relative path to saved file

    Raises:
        HTTPException: If file is invalid
    """
    # Validate file extension
    file_ext = upload_file.filename.split(".")[-1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS_LIST:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )

    # Validate file size
    upload_file.file.seek(0, 2)  # Seek to end
    file_size = upload_file.file.tell()
    upload_file.file.seek(0)  # Reset to start

    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as f:
        f.write(upload_file.file.read())

    return f"/uploads/{unique_filename}"


@router.post("/upload-image", response_model=dict)
async def upload_food_image(
    file: UploadFile = File(...),
    profile: RestaurantProfile = Depends(get_current_approved_restaurant_profile)
):
    """
    Upload a food image

    - Requires approved restaurant profile
    - Max file size: 5MB
    - Allowed formats: jpg, jpeg, png, webp

    Returns:
        - image_url: URL to access the uploaded image
    """
    image_url = save_upload_file(file)

    return {"image_url": image_url}


@router.post("/", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
async def create_food(
    food_data: FoodCreate,
    profile: RestaurantProfile = Depends(get_current_approved_restaurant_profile),
    db: Session = Depends(get_db)
):
    """
    Create a new food item

    - Requires approved restaurant profile
    - Price must be positive
    - old_price (if provided) must be greater than price
    """
    # Create food item
    new_food = Food(
        name=food_data.name,
        description=food_data.description,
        image=food_data.image,
        price=food_data.price,
        old_price=food_data.old_price,
        quantity=food_data.quantity,
        expires_at=food_data.expires_at,
        restaurant_id=profile.user_id,  # Legacy field
        restaurant_profile_id=profile.id,  # New field
        is_available=True,
    )

    # Calculate discount if old_price provided
    new_food.calculate_discount()

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    # Manually add restaurant_name for response
    new_food.restaurant_name = profile.name

    return new_food


@router.get("/", response_model=List[FoodResponse])
async def get_all_foods(
    restaurant_profile_id: Optional[int] = None,
    available_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all available food items

    - **restaurant_profile_id**: Filter by restaurant profile (optional)
    - **available_only**: Show only available items (default: true)
    - **skip**: Pagination offset
    - **limit**: Number of items to return
    """
    query = db.query(Food)

    # Filter by restaurant profile
    if restaurant_profile_id:
        query = query.filter(Food.restaurant_profile_id == restaurant_profile_id)

    # Filter by availability
    if available_only:
        query = query.filter(
            Food.is_available == True,
            Food.quantity > 0
        )

    # Apply pagination
    foods = query.offset(skip).limit(limit).all()

    # Add restaurant_name to each food
    for food in foods:
        if food.restaurant_profile:
            food.restaurant_name = food.restaurant_profile.name
        else:
            food.restaurant_name = food.restaurant.full_name  # Fallback for legacy data

    return foods


@router.get("/my-foods", response_model=List[FoodResponse])
async def get_my_foods(
    profile: RestaurantProfile = Depends(get_current_approved_restaurant_profile),
    db: Session = Depends(get_db)
):
    """
    Get current restaurant's food items

    - Requires approved restaurant profile
    - Returns all foods (including unavailable)
    """
    foods = db.query(Food).filter(Food.restaurant_profile_id == profile.id).all()

    # Add restaurant_name
    for food in foods:
        food.restaurant_name = profile.name

    return foods


@router.get("/{food_id}", response_model=FoodResponse)
async def get_food_by_id(food_id: int, db: Session = Depends(get_db)):
    """Get food item by ID"""
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )

    # Add restaurant_name
    if food.restaurant_profile:
        food.restaurant_name = food.restaurant_profile.name
    else:
        food.restaurant_name = food.restaurant.full_name  # Fallback for legacy data

    return food


@router.put("/{food_id}", response_model=FoodResponse)
async def update_food(
    food_id: int,
    food_data: FoodUpdate,
    profile: RestaurantProfile = Depends(get_current_approved_restaurant_profile),
    db: Session = Depends(get_db)
):
    """
    Update a food item

    - Requires approved restaurant profile
    - Can only update own foods
    """
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )

    # Check ownership
    if food.restaurant_profile_id != profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this food item"
        )

    # Update fields
    update_data = food_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(food, field, value)

    # Recalculate discount
    food.calculate_discount()
    food.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(food)

    # Add restaurant_name
    food.restaurant_name = profile.name

    return food


@router.delete("/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food(
    food_id: int,
    profile: RestaurantProfile = Depends(get_current_approved_restaurant_profile),
    db: Session = Depends(get_db)
):
    """
    Delete a food item

    - Requires approved restaurant profile
    - Can only delete own foods
    """
    food = db.query(Food).filter(Food.id == food_id).first()

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )

    # Check ownership
    if food.restaurant_profile_id != profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this food item"
        )

    db.delete(food)
    db.commit()

    return None
