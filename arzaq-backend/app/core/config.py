# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application configuration settings"""

    # App Info
    APP_NAME: str = "ARZAQ Food Rescue API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days

    # Supabase
    SUPABASE_URL: str
    SUPABASE_JWT_SECRET: str
    SUPABASE_SERVICE_KEY: str

    # CORS
    FRONTEND_URL: str
    FRONTEND_DEV_URL: str = "http://localhost:5173"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Get list of allowed CORS origins"""
        return [
            self.FRONTEND_URL,
            self.FRONTEND_DEV_URL,
            "http://localhost:3000",  # Alternative dev port
        ]

    # PayBox Kazakhstan
    PAYBOX_MERCHANT_ID: str
    PAYBOX_SECRET_KEY: str
    PAYBOX_PAYMENT_URL: str = "https://api.paybox.money/payment.php"
    PAYBOX_SUCCESS_URL: str
    PAYBOX_FAILURE_URL: str
    PAYBOX_RESULT_URL: str

    # Platform Fee
    PLATFORM_FEE_PERCENTAGE: int = 10

    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    ALLOWED_EXTENSIONS: str = "jpg,jpeg,png,webp"

    @property
    def ALLOWED_EXTENSIONS_LIST(self) -> List[str]:
        return self.ALLOWED_EXTENSIONS.split(",")

    # QR Codes
    QR_CODE_DIR: str = "./uploads/qr_codes"

    # Reservation
    RESERVATION_TIMEOUT_MINUTES: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


# Initialize settings
settings = Settings()

# Ensure upload directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.QR_CODE_DIR, exist_ok=True)
