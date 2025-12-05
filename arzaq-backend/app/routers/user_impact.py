# app/routers/user_impact.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_impact import UserImpact
from app.schemas.user_impact import UserImpactResponse, UserImpactUpdate

router = APIRouter()


@router.get("/me/impact", response_model=UserImpactResponse)
async def get_my_impact(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's environmental impact statistics

    - Returns meals rescued, CO2 saved, progress towards goals
    - Automatically creates impact record if it doesn't exist
    """
    # Get or create user impact
    user_impact = db.query(UserImpact).filter(UserImpact.user_id == current_user.id).first()

    if not user_impact:
        # Create new impact record for user
        user_impact = UserImpact(user_id=current_user.id)
        db.add(user_impact)
        db.commit()
        db.refresh(user_impact)

    return user_impact


@router.put("/me/impact/goals", response_model=UserImpactResponse)
async def update_my_goals(
    goals_data: UserImpactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user's personal goals

    - Allows users to set custom monthly goals
    - Goals must be positive numbers
    """
    # Get or create user impact
    user_impact = db.query(UserImpact).filter(UserImpact.user_id == current_user.id).first()

    if not user_impact:
        user_impact = UserImpact(user_id=current_user.id)
        db.add(user_impact)

    # Update goals
    if goals_data.meals_goal is not None:
        if goals_data.meals_goal <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meals goal must be positive"
            )
        user_impact.meals_goal = goals_data.meals_goal

    if goals_data.co2_goal is not None:
        if goals_data.co2_goal <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CO2 goal must be positive"
            )
        user_impact.co2_goal = goals_data.co2_goal

    db.commit()
    db.refresh(user_impact)

    return user_impact


@router.get("/{user_id}/impact", response_model=UserImpactResponse)
async def get_user_impact(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get any user's public impact statistics

    - Public endpoint (no authentication required)
    - Shows user's environmental contribution
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_impact = db.query(UserImpact).filter(UserImpact.user_id == user_id).first()

    if not user_impact:
        # Return default values if no impact yet
        return {
            "id": 0,
            "user_id": user_id,
            "meals_rescued": 0,
            "co2_saved": 0.0,
            "total_orders": 0,
            "meals_goal": 30,
            "co2_goal": 10.0,
            "meals_progress": 0.0,
            "co2_progress": 0.0,
            "created_at": user.created_at,
            "updated_at": None,
        }

    return user_impact
