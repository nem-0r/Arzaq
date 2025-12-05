// src/api/services/post.service.js
import apiClient from '../client';

/**
 * Post Service - работа с постами
 */
const postService = {
  /**
   * Получить все посты
   * @param {Object} params - {skip, limit}
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await apiClient.get(`/api/posts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get posts:', error);
      throw error;
    }
  },

  /**
   * Получить пост по ID
   * @param {number} postId
   * @returns {Promise<Object>}
   */
  async getById(postId) {
    try {
      const response = await apiClient.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get post:', error);
      throw error;
    }
  },

  /**
   * Создать новый пост (требует авторизации)
   * @param {Object} postData - {text, restaurant_id, location, image_url}
   * @returns {Promise<Object>}
   */
  async create(postData) {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  },

  /**
   * Обновить пост (требует авторизации и владения постом)
   * @param {number} postId
   * @param {Object} postData - {text, image_url}
   * @returns {Promise<Object>}
   */
  async update(postId, postData) {
    try {
      const response = await apiClient.put(`/api/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('error_not_owner');
      }
      console.error('Failed to update post:', error);
      throw error;
    }
  },

  /**
   * Удалить пост (требует авторизации и владения постом)
   * @param {number} postId
   * @returns {Promise<void>}
   */
  async delete(postId) {
    try {
      await apiClient.delete(`/api/posts/${postId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('error_not_owner');
      }
      console.error('Failed to delete post:', error);
      throw error;
    }
  },
};

export default postService;
