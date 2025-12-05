# app/schemas/user_impact.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserImpactResponse(BaseModel):
    """Schema for user impact statistics response"""
    id: int
    user_id: int
    meals_rescued: int
    co2_saved: float
    total_orders: int
    meals_goal: int
    co2_goal: float
    meals_progress: float  # 0-100%
    co2_progress: float  # 0-100%
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserImpactUpdate(BaseModel):
    """Schema for updating user impact goals"""
    meals_goal: Optional[int] = None
    co2_goal: Optional[float] = None
