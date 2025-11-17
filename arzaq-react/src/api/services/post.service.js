// src/api/services/post.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Post Service - работа с постами
 */
const postService = {
  /**
   * Получить все посты
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.POSTS.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Создать новый пост (требует авторизации)
   * @param {Object} postData - {title, content}
   * @returns {Promise<Object>}
   */
  async create(postData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.POSTS.BASE, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Обновить пост (требует авторизации и владения постом)
   * @param {number} id
   * @param {Object} postData - {title, content}
   * @returns {Promise<Object>}
   */
  async update(id, postData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.POSTS.BY_ID(id), postData);
      return response.data;
    } catch (error) {
      if (error.status === 403) {
        throw new Error('error_not_owner');
      }
      throw error;
    }
  },

  /**
   * Удалить пост (требует авторизации и владения постом)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.POSTS.BY_ID(id));
    } catch (error) {
      if (error.status === 403) {
        throw new Error('error_not_owner');
      }
      throw error;
    }
  },
};

export default postService;
