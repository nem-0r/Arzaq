# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_supabase_token,
    get_current_user
)
from app.core.config import settings
from app.models.user import User, UserRole
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    SupabaseAuthRequest
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user (client or restaurant)

    - **email**: Valid email address
    - **password**: Minimum 6 characters
    - **full_name**: User's full name
    - **role**: Either "client" or "restaurant"
    - **address**: Required for restaurant role
    - **phone**: Optional phone number
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Create new user
    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=UserRole(user_data.role),
        is_active=True,
        is_approved=user_data.role == "client",  # Auto-approve clients, restaurants need admin approval
    )

    # Add restaurant-specific fields
    if user_data.role == "restaurant":
        new_user.address = user_data.address
        new_user.phone = user_data.phone
        new_user.description = user_data.description

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with email and password

    Returns JWT access token for subsequent API calls
    """
    # Find user by email (OAuth2 uses 'username' but we store email)
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value, "user_id": user.id}
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/supabase", response_model=dict)
async def supabase_auth(auth_data: SupabaseAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate via Supabase OAuth

    This endpoint receives Supabase session data from frontend,
    verifies the token, and creates/updates user in our database.

    Returns our own JWT token for subsequent API calls.
    """
    # Verify Supabase token
    try:
        supabase_payload = verify_supabase_token(auth_data.supabase_token)
    except HTTPException as e:
        raise e

    # ✅ VALIDATION: Restaurant role is not allowed via OAuth
    # Restaurants MUST register via email with business details (address, phone, etc.)
    if auth_data.role == "restaurant":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Restaurant registration via Google OAuth is not allowed. Please register using email/password with your business details (address, phone, etc.)."
        )

    # Check if user exists by google_id or email
    user = db.query(User).filter(
        (User.google_id == auth_data.google_id) | (User.email == auth_data.email)
    ).first()

    if user:
        # ✅ VALIDATION: If existing user is a restaurant, they cannot use OAuth
        if user.role == UserRole.restaurant:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Restaurant accounts cannot use Google OAuth. Please login with your email and password."
            )

        # Update existing user
        user.supabase_id = supabase_payload.get("sub")
        if not user.google_id:
            user.google_id = auth_data.google_id

        # Update full_name if it changed
        if user.full_name != auth_data.full_name:
            user.full_name = auth_data.full_name

        db.commit()
        db.refresh(user)
    else:
        # Create new user (only clients can use OAuth)
        user = User(
            email=auth_data.email,
            full_name=auth_data.full_name,
            google_id=auth_data.google_id,
            supabase_id=supabase_payload.get("sub"),
            role=UserRole.client,  # ✅ Always client for OAuth
            is_active=True,
            is_approved=True,  # Auto-approve clients
            hashed_password=None,  # No password for OAuth users
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # Create our own JWT token
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value, "user_id": user.id}
    )

    return {
        "user": UserResponse.from_orm(user),
        "token": access_token
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information

    Requires valid JWT token in Authorization header
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile

    Allowed fields: full_name, phone, address, description, latitude, longitude
    """
    # Update allowed fields
    allowed_fields = ["full_name", "phone", "address", "description", "latitude", "longitude"]

    for field, value in user_update.items():
        if field in allowed_fields and value is not None:
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user
