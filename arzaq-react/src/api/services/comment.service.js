// src/api/services/comment.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Comment Service - работа с комментариями
 */
const commentService = {
  /**
   * Получить все комментарии или комментарии для определенного места
   * @param {number|null} placeId - ID места (опционально)
   * @returns {Promise<Array>}
   */
  async getAll(placeId = null) {
    try {
      const url = placeId
        ? API_ENDPOINTS.COMMENTS.BY_PLACE(placeId)
        : API_ENDPOINTS.COMMENTS.BASE;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Создать новый комментарий (требует авторизации)
   * @param {Object} commentData - {place_id, text}
   * @returns {Promise<Object>}
   */
  async create(commentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COMMENTS.BASE, commentData);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        throw new Error('error_place_not_found');
      }
      throw error;
    }
  },

  /**
   * Удалить комментарий (требует авторизации и владения комментарием)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.COMMENTS.BY_ID(id));
    } catch (error) {
      if (error.status === 403) {
        throw new Error('error_not_owner');
      }
      throw error;
    }
  },
};

export default commentService;
