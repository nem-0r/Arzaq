# app/models/user_impact.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class UserImpact(Base):
    """
    User Impact Statistics Model

    Tracks user's environmental impact through food rescue:
    - Meals rescued (saved from waste)
    - CO2 saved (in kilograms)
    - Total completed orders
    """

    __tablename__ = "user_impacts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Statistics
    meals_rescued = Column(Integer, default=0, nullable=False)  # Total meals saved
    co2_saved = Column(Float, default=0.0, nullable=False)  # CO2 saved in kg
    total_orders = Column(Integer, default=0, nullable=False)  # Total completed orders

    # Goals (can be customized per user in future)
    meals_goal = Column(Integer, default=30, nullable=False)  # Monthly goal
    co2_goal = Column(Float, default=10.0, nullable=False)  # Monthly CO2 goal in kg

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="impact")

    def __repr__(self):
        return f"<UserImpact(user_id={self.user_id}, meals={self.meals_rescued}, co2={self.co2_saved}kg)>"

    @property
    def meals_progress(self) -> float:
        """Calculate progress towards meals goal (0-100%)"""
        if self.meals_goal <= 0:
            return 0.0
        return min((self.meals_rescued / self.meals_goal) * 100, 100.0)

    @property
    def co2_progress(self) -> float:
        """Calculate progress towards CO2 goal (0-100%)"""
        if self.co2_goal <= 0:
            return 0.0
        return min((self.co2_saved / self.co2_goal) * 100, 100.0)

    def add_meal_impact(self, meal_count: int):
        """
        Add impact from completed order

        Args:
            meal_count: Number of meals in the order
        """
        CO2_PER_MEAL = 0.18  # kg CO2 saved per meal

        self.meals_rescued += meal_count
        self.co2_saved += meal_count * CO2_PER_MEAL
        self.total_orders += 1
