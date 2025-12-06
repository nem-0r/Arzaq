# app/schemas/__init__.py
from .user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    RestaurantCreate,
    RestaurantUpdate,
    RestaurantResponse,
    Token,
    SupabaseAuthRequest
)
from .food import (
    FoodCreate,
    FoodUpdate,
    FoodResponse,
    FoodListResponse
)
from .order import (
    OrderCreate,
    OrderResponse,
    OrderItemResponse,
    OrderListResponse
)
from .payment import (
    PaymentCreate,
    PaymentResponse,
    PayBoxCallbackRequest
)
from .post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    CommentCreate,
    CommentUpdate,
    CommentResponse,
    LikeResponse
)

__all__ = [
    # User
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "RestaurantCreate",
    "RestaurantUpdate",
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
    "CommentCreate",
    "CommentUpdate",
    "CommentResponse",
    "LikeResponse",
]
