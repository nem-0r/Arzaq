# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, foods, restaurants, orders, payments, posts
import os

# Create database tables
Base.metadata.create_all(bind=engine)


# Middleware to handle proxy headers (Railway/Cloudflare)
class ProxyHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Get forwarded protocol from proxy
        forwarded_proto = request.headers.get("x-forwarded-proto")
        forwarded_host = request.headers.get("x-forwarded-host")

        # Force HTTPS for Railway domain
        if forwarded_host and "railway.app" in forwarded_host:
            request.scope["scheme"] = "https"
        elif forwarded_proto:
            request.scope["scheme"] = forwarded_proto

        response = await call_next(request)
        return response


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API for ARZAQ Food Rescue Platform",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# IMPORTANT: Add proxy headers middleware FIRST
app.add_middleware(ProxyHeadersMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mount static files (uploads)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(foods.router, prefix="/api/foods", tags=["Foods"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(posts.router, prefix="/api/posts", tags=["Posts"])


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "ARZAQ Food Rescue API",
        "version": settings.VERSION,
        "status": "online",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.ENVIRONMENT == "development",
    )
