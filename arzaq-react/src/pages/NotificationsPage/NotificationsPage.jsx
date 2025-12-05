// src/pages/NotificationsPage/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoCheckmarkCircle,
  IoCheckmarkDoneCircle,
  IoTrashOutline,
  IoTimeOutline,
  IoInformationCircleOutline,
  IoCheckmarkOutline,
  IoRestaurantOutline,
  IoCartOutline,
  IoChatbubbleOutline
} from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import { notificationService } from '../../api/services';
import { useAuth } from '../../hooks/useAuth';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated, navigate]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update all notifications to read
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      // Remove from local state
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }

    try {
      await notificationService.clearAll();
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_CREATED':
      case 'ORDER_CONFIRMED':
      case 'ORDER_READY':
      case 'ORDER_COMPLETED':
        return <IoCartOutline size={24} />;
      case 'RESTAURANT_APPROVED':
      case 'RESTAURANT_REJECTED':
        return <IoRestaurantOutline size={24} />;
      case 'NEW_POST_LIKE':
      case 'NEW_POST_COMMENT':
        return <IoChatbubbleOutline size={24} />;
      case 'SYSTEM':
      default:
        return <IoInformationCircleOutline size={24} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ORDER_CREATED':
      case 'ORDER_CONFIRMED':
        return 'var(--primary-green)';
      case 'ORDER_READY':
        return 'var(--accent-orange)';
      case 'ORDER_COMPLETED':
        return 'var(--success-green)';
      case 'RESTAURANT_APPROVED':
        return 'var(--success-green)';
      case 'RESTAURANT_REJECTED':
        return 'var(--error-red)';
      case 'NEW_POST_LIKE':
      case 'NEW_POST_COMMENT':
        return 'var(--accent-blue)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        {/* Header */}
        <div className={styles.pageHeader}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <IoArrowBack size={24} />
          </button>
          <h1 className={styles.pageTitle}>Notifications</h1>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.filterTab} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`${styles.filterTab} ${filter === 'read' ? styles.active : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className={styles.actionButtons}>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className={styles.actionBtn}>
                <IoCheckmarkDoneCircle size={18} />
                <span>Mark all as read</span>
              </button>
            )}
            <button onClick={handleClearAll} className={styles.actionBtn}>
              <IoTrashOutline size={18} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <IoInformationCircleOutline size={48} />
            <p>{error}</p>
            <button onClick={loadNotifications} className={styles.retryBtn}>
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className={styles.notificationsList}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationCard} ${
                  !notification.is_read ? styles.unread : ''
                }`}
              >
                <div
                  className={styles.iconWrapper}
                  style={{ color: getNotificationColor(notification.type) }}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className={styles.content}>
                  <h3 className={styles.title}>{notification.title}</h3>
                  <p className={styles.message}>{notification.message}</p>
                  <div className={styles.footer}>
                    <span className={styles.time}>
                      <IoTimeOutline size={14} />
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className={styles.markReadBtn}
                      title="Mark as read"
                    >
                      <IoCheckmarkCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className={styles.deleteBtn}
                    title="Delete"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <IoNotificationsOutline size={64} />
            <h3>No notifications</h3>
            <p>
              {filter === 'unread'
                ? 'You have no unread notifications'
                : filter === 'read'
                ? 'You have no read notifications'
                : 'You have no notifications yet'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
