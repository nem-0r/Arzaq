// src/api/services/user.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * User Service - работа с пользователями
 */
const userService = {
  /**
   * Получить пользователя по ID (требует авторизации)
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        throw new Error('error_user_not_found');
      }
      throw error;
    }
  },
};

export default userService;
