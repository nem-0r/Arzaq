# app/routers/upload.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import Optional
import os
import uuid

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save uploaded file and return its path

    Args:
        upload_file: FastAPI UploadFile

    Returns:
        Relative path to saved file

    Raises:
        HTTPException: If file is invalid
    """
    # Validate file extension
    file_ext = upload_file.filename.split(".")[-1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS_LIST:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )

    # Validate file size
    upload_file.file.seek(0, 2)  # Seek to end
    file_size = upload_file.file.tell()
    upload_file.file.seek(0)  # Reset to start

    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as f:
        f.write(upload_file.file.read())

    return f"/uploads/{unique_filename}"


@router.post("/image", response_model=dict)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image file

    - Requires authentication
    - Max file size: 5MB
    - Allowed formats: jpg, jpeg, png, webp

    Returns:
        - image_url: URL to access the uploaded image
    """
    image_url = save_upload_file(file)

    return {
        "image_url": image_url,
        "filename": file.filename
    }


@router.delete("/image", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_url: str,
    current_user: User = Depends(get_current_user)
):
    """
    Delete an uploaded image

    - Requires authentication
    - Provide image_url to delete
    """
    # Extract filename from URL
    if not image_url.startswith("/uploads/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image URL"
        )

    filename = image_url.split("/uploads/")[1]
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    # Check if file exists
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )

    # Delete file
    try:
        os.remove(file_path)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {str(e)}"
        )

    return None
