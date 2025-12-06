# app/routers/restaurant_profiles.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin, get_current_restaurant
from app.models.user import User, UserRole
from app.models.restaurant_profile import RestaurantProfile, RestaurantStatus
from app.schemas.restaurant import (
    RestaurantProfileCreate,
    RestaurantProfileUpdate,
    RestaurantProfileResponse,
    RestaurantProfileWithUser,
    RestaurantApproval
)

router = APIRouter()


@router.post("/", response_model=RestaurantProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant_profile(
    profile_data: RestaurantProfileCreate,
    current_user: User = Depends(get_current_restaurant),
    db: Session = Depends(get_db)
):
    """
    Create restaurant profile (only for restaurant users)

    - Requires restaurant role
    - One profile per user
    - Status: pending approval by admin
    """
    # Check if profile already exists
    existing_profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Restaurant profile already exists. Use PUT to update."
        )

    # Create new restaurant profile
    new_profile = RestaurantProfile(
        user_id=current_user.id,
        name=profile_data.name,
        description=profile_data.description,
        address=profile_data.address,
        phone=profile_data.phone,
        latitude=profile_data.latitude,
        longitude=profile_data.longitude,
        logo=profile_data.logo,
        cover_image=profile_data.cover_image,
        status=RestaurantStatus.PENDING
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get("/my-profile", response_model=RestaurantProfileResponse)
async def get_my_restaurant_profile(
    current_user: User = Depends(get_current_restaurant),
    db: Session = Depends(get_db)
):
    """
    Get current restaurant's profile

    - Requires restaurant role
    - Returns own profile or 404 if not created yet
    """
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found. Please create one first."
        )

    return profile


@router.put("/my-profile", response_model=RestaurantProfileResponse)
async def update_my_restaurant_profile(
    profile_data: RestaurantProfileUpdate,
    current_user: User = Depends(get_current_restaurant),
    db: Session = Depends(get_db)
):
    """
    Update current restaurant's profile

    - Requires restaurant role
    - Can only update own profile
    """
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found. Please create one first."
        )

    # Update fields
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile


@router.get("/", response_model=List[RestaurantProfileResponse])
async def get_all_restaurants(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    approved_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all restaurant profiles

    - **status_filter**: Filter by status ('pending', 'approved', 'rejected')
    - **search**: Search by name or address
    - **approved_only**: Show only approved restaurants (default: true)
    - **skip**: Pagination offset
    - **limit**: Number of items to return
    """
    query = db.query(RestaurantProfile)

    # Filter by status
    if status_filter:
        try:
            status_enum = RestaurantStatus(status_filter)
            query = query.filter(RestaurantProfile.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: pending, approved, rejected"
            )
    elif approved_only:
        query = query.filter(RestaurantProfile.status == RestaurantStatus.APPROVED)

    # Search by name or address
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (RestaurantProfile.name.ilike(search_term)) |
            (RestaurantProfile.address.ilike(search_term))
        )

    restaurants = query.offset(skip).limit(limit).all()

    return restaurants


@router.get("/pending", response_model=List[RestaurantProfileWithUser])
async def get_pending_restaurants(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all pending restaurant profiles awaiting approval

    - Requires admin role
    - Returns pending profiles with user information
    """
    profiles = db.query(RestaurantProfile).filter(
        RestaurantProfile.status == RestaurantStatus.PENDING
    ).all()

    # Add user information
    result = []
    for profile in profiles:
        profile_dict = RestaurantProfileResponse.from_orm(profile).dict()
        profile_dict['user_email'] = profile.user.email
        profile_dict['user_full_name'] = profile.user.full_name
        result.append(profile_dict)

    return result


@router.get("/{profile_id}", response_model=RestaurantProfileResponse)
async def get_restaurant_profile_by_id(
    profile_id: int,
    db: Session = Depends(get_db)
):
    """Get restaurant profile by ID"""
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found"
        )

    return profile


@router.put("/{profile_id}/approve", response_model=RestaurantProfileResponse)
async def approve_restaurant_profile(
    profile_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Approve a restaurant profile

    - Requires admin role
    - Sets status to APPROVED
    """
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found"
        )

    profile.status = RestaurantStatus.APPROVED
    profile.approved_at = datetime.utcnow()
    profile.rejection_reason = None  # Clear any previous rejection reason

    db.commit()
    db.refresh(profile)

    return profile


@router.put("/{profile_id}/reject", response_model=RestaurantProfileResponse)
async def reject_restaurant_profile(
    profile_id: int,
    rejection_reason: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Reject a restaurant profile

    - Requires admin role
    - Sets status to REJECTED
    - Requires rejection reason
    """
    if not rejection_reason or len(rejection_reason.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rejection reason must be at least 10 characters"
        )

    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found"
        )

    profile.status = RestaurantStatus.REJECTED
    profile.rejection_reason = rejection_reason

    db.commit()
    db.refresh(profile)

    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant_profile(
    profile_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a restaurant profile

    - Requires admin role
    - Permanently deletes profile and all associated foods
    """
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == profile_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant profile not found"
        )

    db.delete(profile)
    db.commit()

    return None
