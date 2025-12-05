// src/api/services/like.service.js
import apiClient from '../client';

/**
 * Like Service - работа с лайками постов
 */
const likeService = {
  /**
   * Переключить лайк на посте (like/unlike)
   * @param {number} postId
   * @returns {Promise<Object>} - {success, is_liked, likes_count}
   */
  async toggleLike(postId) {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  },

  /**
   * Получить все лайки поста
   * @param {number} postId
   * @returns {Promise<Object>} - {success, likes_count, user_ids}
   */
  async getPostLikes(postId) {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/likes`);
      return response.data;
    } catch (error) {
      console.error('Failed to get post likes:', error);
      throw error;
    }
  },
};

export default likeService;
