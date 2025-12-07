# app/schemas/__init__.py
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    RestaurantResponse,
    Token,
    SupabaseAuthRequest
)
from app.schemas.food import (
    FoodCreate,
    FoodUpdate,
    FoodResponse,
    FoodListResponse
)
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderItemResponse,
    OrderListResponse
)
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
    PayBoxCallbackRequest
)
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse
)

__all__ = [
    # User
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "RestaurantResponse",
    "Token",
    "SupabaseAuthRequest",
    # Food
    "FoodCreate",
    "FoodUpdate",
    "FoodResponse",
    "FoodListResponse",
    # Order
    "OrderCreate",
    "OrderResponse",
    "OrderItemResponse",
    "OrderListResponse",
    # Payment
    "PaymentCreate",
    "PaymentResponse",
    "PayBoxCallbackRequest",
    # Post
    "PostCreate",
    "PostUpdate",
    "PostResponse",
]
