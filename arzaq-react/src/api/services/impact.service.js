// src/api/services/impact.service.js
import apiClient from '../client';

/**
 * User Impact Service - работа со статистикой пользователя
 */
const impactService = {
  /**
   * Получить статистику текущего пользователя
   * @returns {Promise<Object>}
   */
  async getMyImpact() {
    try {
      const response = await apiClient.get('/api/users/me/impact');
      return response.data;
    } catch (error) {
      console.error('Failed to get user impact:', error);
      throw error;
    }
  },

  /**
   * Обновить личные цели пользователя
   * @param {Object} goals - {meals_goal, co2_goal}
   * @returns {Promise<Object>}
   */
  async updateGoals(goals) {
    try {
      const response = await apiClient.put('/api/users/me/impact/goals', goals);
      return response.data;
    } catch (error) {
      console.error('Failed to update goals:', error);
      throw error;
    }
  },

  /**
   * Получить публичную статистику пользователя по ID
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getUserImpact(userId) {
    try {
      const response = await apiClient.get(`/api/users/${userId}/impact`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user impact:', error);
      throw error;
    }
  },
};

export default impactService;
