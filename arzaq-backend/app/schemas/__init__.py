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
    PostResponse,
    PostWithDetails,
    PostUpdate
)
from app.schemas.comment import (
    CommentCreate,
    CommentResponse,
    CommentUpdate
)
from app.schemas.user_impact import (
    UserImpactResponse,
    UserImpactUpdate
)
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationMarkRead
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
    "PostResponse",
    "PostWithDetails",
    "PostUpdate",
    # Comment
    "CommentCreate",
    "CommentResponse",
    "CommentUpdate",
    # User Impact
    "UserImpactResponse",
    "UserImpactUpdate",
    # Notification
    "NotificationCreate",
    "NotificationResponse",
    "NotificationMarkRead",
]
