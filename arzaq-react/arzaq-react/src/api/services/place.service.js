// src/api/services/place.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Place Service - работа с местами
 */
const placeService = {
  /**
   * Получить все места
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PLACES.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Получить место по ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PLACES.BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Создать новое место (требует авторизации)
   * @param {Object} placeData - {name, latitude, longitude}
   * @returns {Promise<Object>}
   */
  async create(placeData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PLACES.BASE, placeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Обновить место (требует авторизации и владения местом)
   * @param {number} id
   * @param {Object} placeData - {name, latitude, longitude}
   * @returns {Promise<Object>}
   */
  async update(id, placeData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PLACES.BY_ID(id), placeData);
      return response.data;
    } catch (error) {
      if (error.status === 403) {
        throw new Error('error_not_owner');
      }
      throw error;
    }
  },

  /**
   * Удалить место (требует авторизации и владения местом)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.PLACES.BY_ID(id));
    } catch (error) {
      if (error.status === 403) {
        throw new Error('error_not_owner');
      }
      throw error;
    }
  },
};

export default placeService;
