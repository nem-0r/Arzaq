// src/api/services/comment.service.js
import apiClient from '../client';

/**
 * Comment Service - работа с комментариями
 */
const commentService = {
  /**
   * Получить все комментарии поста
   * @param {number} postId - ID поста
   * @returns {Promise<Array>}
   */
  async getPostComments(postId) {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Failed to get comments:', error);
      throw error;
    }
  },

  /**
   * Создать новый комментарий (требует авторизации)
   * @param {number} postId - ID поста
   * @param {Object} commentData - {text}
   * @returns {Promise<Object>}
   */
  async create(postId, commentData) {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('error_post_not_found');
      }
      console.error('Failed to create comment:', error);
      throw error;
    }
  },

  /**
   * Обновить комментарий (требует авторизации и владения)
   * @param {number} commentId
   * @param {Object} commentData - {text}
   * @returns {Promise<Object>}
   */
  async update(commentId, commentData) {
    try {
      const response = await apiClient.put(`/api/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('error_not_owner');
      }
      console.error('Failed to update comment:', error);
      throw error;
    }
  },

  /**
   * Удалить комментарий (требует авторизации и владения комментарием)
   * @param {number} commentId
   * @returns {Promise<void>}
   */
  async delete(commentId) {
    try {
      await apiClient.delete(`/api/comments/${commentId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('error_not_owner');
      }
      console.error('Failed to delete comment:', error);
      throw error;
    }
  },
};

export default commentService;
