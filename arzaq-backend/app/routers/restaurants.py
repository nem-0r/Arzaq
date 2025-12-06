# app/routers/restaurants.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin, get_current_restaurant, get_current_active_restaurant
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, RestaurantResponse, RestaurantCreate, RestaurantUpdate

router = APIRouter()


@router.get("/", response_model=List[RestaurantResponse])
async def get_all_restaurants(
    status: Optional[str] = None,
    search: Optional[str] = None,
    approved_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all restaurants

    - **status**: Filter by status ('approved', 'pending', 'rejected')
    - **search**: Search by name or address
    - **approved_only**: Show only approved restaurants (default: true)
    - **skip**: Pagination offset
    - **limit**: Number of items to return
    """
    query = db.query(User).filter(User.role == UserRole.RESTAURANT)

    # Filter by status
    if status == 'approved':
        query = query.filter(User.is_approved == True, User.is_active == True)
    elif status == 'pending':
        query = query.filter(User.is_approved == False, User.is_active == True)
    elif status == 'rejected':
        query = query.filter(User.is_active == False)
    elif approved_only:
        query = query.filter(User.is_approved == True, User.is_active == True)

    # Search by name or address
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) |
            (User.address.ilike(search_term))
        )

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


@router.get("/me", response_model=RestaurantResponse)
async def get_my_restaurant(
    current_user: User = Depends(get_current_restaurant),
    db: Session = Depends(get_db)
):
    """
    Get current restaurant's profile

    - Requires restaurant role (approved or pending)
    - Returns own restaurant details with approval status
    """
    return current_user


@router.post("/", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    restaurant_data: RestaurantCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new restaurant

    - Creates restaurant user account
    - Status: pending approval by admin
    - Password is optional (for OAuth users)
    """
    from app.core.security import get_password_hash

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == restaurant_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Create new restaurant
    new_restaurant = User(
        email=restaurant_data.email,
        full_name=restaurant_data.full_name,
        hashed_password=get_password_hash(restaurant_data.password) if restaurant_data.password else None,
        role=UserRole.RESTAURANT,
        address=restaurant_data.address,
        phone=restaurant_data.phone,
        description=restaurant_data.description,
        latitude=restaurant_data.latitude,
        longitude=restaurant_data.longitude,
        is_active=True,
        is_approved=False,  # Requires admin approval
    )

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return new_restaurant


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update restaurant profile

    - Restaurant can update own profile
    - Admin can update any restaurant
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

    # Check permissions (owner or admin)
    if current_user.id != restaurant_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this restaurant"
        )

    # Update fields
    update_data = restaurant_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)

    return restaurant


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant(
    restaurant_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a restaurant

    - Requires admin role
    - Permanently deletes restaurant account
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

    db.delete(restaurant)
    db.commit()

    return None
