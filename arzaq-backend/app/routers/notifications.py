# app/routers/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse, NotificationMarkRead

router = APIRouter()


@router.get("/me/notifications", response_model=List[NotificationResponse])
async def get_my_notifications(
    unread_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's notifications

    - **unread_only**: Filter to show only unread notifications
    - **skip**: Pagination offset
    - **limit**: Number of notifications to return
    - Returns notifications ordered by newest first
    """
    query = db.query(Notification).filter(Notification.user_id == current_user.id)

    if unread_only:
        query = query.filter(Notification.is_read == False)

    notifications = (
        query
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(min(limit, 100))
        .all()
    )

    return notifications


@router.get("/me/notifications/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of unread notifications

    - Returns number of unread notifications
    - Useful for notification badge
    """
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
        .count()
    )

    return {"unread_count": count}


@router.put("/me/notifications/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a notification as read

    - Requires authentication
    - Only notification owner can mark as read
    """
    notification = db.query(Notification).filter(Notification.id == notification_id).first()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    # Check ownership
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark your own notifications as read"
        )

    # Mark as read
    notification.mark_as_read()
    db.commit()
    db.refresh(notification)

    return notification


@router.put("/me/notifications/mark-all-read")
async def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all user's notifications as read

    - Bulk operation
    - Returns count of marked notifications
    """
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
        .all()
    )

    count = 0
    for notification in notifications:
        notification.mark_as_read()
        count += 1

    db.commit()

    return {
        "success": True,
        "marked_count": count,
        "message": f"Marked {count} notifications as read"
    }


@router.delete("/me/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a notification

    - Requires authentication
    - Only notification owner can delete
    """
    notification = db.query(Notification).filter(Notification.id == notification_id).first()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    # Check ownership
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own notifications"
        )

    db.delete(notification)
    db.commit()

    return None


@router.delete("/me/notifications/clear-all", status_code=status.HTTP_200_OK)
async def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear all user's notifications

    - Deletes all notifications for current user
    - Returns count of deleted notifications
    """
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).all()

    count = len(notifications)
    for notification in notifications:
        db.delete(notification)

    db.commit()

    return {
        "success": True,
        "deleted_count": count,
        "message": f"Cleared {count} notifications"
    }
