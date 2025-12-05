// src/api/services/notification.service.js
import apiClient from '../client';

/**
 * Notification Service - работа с уведомлениями
 */
const notificationService = {
  /**
   * Получить все уведомления текущего пользователя
   * @param {Object} params - {unread_only, skip, limit}
   * @returns {Promise<Array>}
   */
  async getMyNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.unread_only) queryParams.append('unread_only', 'true');
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await apiClient.get(
        `/api/users/me/notifications?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  },

  /**
   * Получить количество непрочитанных уведомлений
   * @returns {Promise<Object>} - {unread_count}
   */
  async getUnreadCount() {
    try {
      const response = await apiClient.get('/api/users/me/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  },

  /**
   * Отметить уведомление как прочитанное
   * @param {number} notificationId
   * @returns {Promise<Object>}
   */
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.put(
        `/api/users/me/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  /**
   * Отметить все уведомления как прочитанные
   * @returns {Promise<Object>}
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.put('/api/users/me/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  },

  /**
   * Удалить уведомление
   * @param {number} notificationId
   * @returns {Promise<void>}
   */
  async deleteNotification(notificationId) {
    try {
      await apiClient.delete(`/api/users/me/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },

  /**
   * Удалить все уведомления
   * @returns {Promise<Object>}
   */
  async clearAll() {
    try {
      const response = await apiClient.delete('/api/users/me/notifications/clear-all');
      return response.data;
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      throw error;
    }
  },
};

export default notificationService;
