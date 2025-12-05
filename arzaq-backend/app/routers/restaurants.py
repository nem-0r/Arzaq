# app/routers/restaurants.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, RestaurantResponse

router = APIRouter()


@router.get("/", response_model=List[RestaurantResponse])
async def get_all_restaurants(
    approved_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all restaurants

    - **approved_only**: Show only approved restaurants (default: true)
    - **skip**: Pagination offset
    - **limit**: Number of items to return
    """
    query = db.query(User).filter(User.role == UserRole.RESTAURANT)

    if approved_only:
        query = query.filter(User.is_approved == True, User.is_active == True)

    restaurants = query.offset(skip).limit(limit).all()

    return restaurants


@router.get("/pending", response_model=List[RestaurantResponse])
async def get_pending_restaurants(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all pending restaurants awaiting approval

    - Requires admin role
    - Returns unapproved restaurants
    """
    restaurants = db.query(User).filter(
        User.role == UserRole.RESTAURANT,
        User.is_approved == False
    ).all()

    return restaurants


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant_by_id(restaurant_id: int, db: Session = Depends(get_db)):
    """Get restaurant details by ID"""
    restaurant = db.query(User).filter(
        User.id == restaurant_id,
        User.role == UserRole.RESTAURANT
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )

    return restaurant


@router.put("/{restaurant_id}/approve", response_model=RestaurantResponse)
async def approve_restaurant(
    restaurant_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Approve a restaurant

    - Requires admin role
    - Sets is_approved to True
    """
    restaurant = db.query(User).filter(
        User.id == restaurant_id,
        User.role == UserRole.RESTAURANT
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )

    restaurant.is_approved = True
    db.commit()
    db.refresh(restaurant)

    return restaurant


@router.put("/{restaurant_id}/reject", response_model=RestaurantResponse)
async def reject_restaurant(
    restaurant_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Reject a restaurant

    - Requires admin role
    - Sets is_approved to False and is_active to False
    """
    restaurant = db.query(User).filter(
        User.id == restaurant_id,
        User.role == UserRole.RESTAURANT
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )

    restaurant.is_approved = False
    restaurant.is_active = False
    db.commit()
    db.refresh(restaurant)

    return restaurant
