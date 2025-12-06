// src/api/services/restaurant.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

const restaurantService = {
  /**
   * Create a new restaurant profile
   * @param {Object} restaurantData - Restaurant information
   * @returns {Promise<Object>} Created restaurant
   */
  createRestaurant: async (restaurantData) => {
    const response = await apiClient.post('/api/restaurants', restaurantData);
    return response.data;
  },

  /**
   * Get all restaurants (with optional filters)
   * @param {Object} params - Filter parameters
   * @returns {Promise<Array>} List of restaurants
   */
  getAllRestaurants: async (params = {}) => {
    const response = await apiClient.get('/api/restaurants', { params });
    return response.data;
  },

  /**
   * Get restaurant by ID
   * @param {number} id - Restaurant ID
   * @returns {Promise<Object>} Restaurant details
   */
  getRestaurantById: async (id) => {
    const response = await apiClient.get(`/api/restaurants/${id}`);
    return response.data;
  },

  /**
   * Update restaurant information
   * @param {number} id - Restaurant ID
   * @param {Object} restaurantData - Updated data
   * @returns {Promise<Object>} Updated restaurant
   */
  updateRestaurant: async (id, restaurantData) => {
    const response = await apiClient.put(`/api/restaurants/${id}`, restaurantData);
    return response.data;
  },

  /**
   * Get current user's restaurant (for restaurant owners)
   * @returns {Promise<Object>} Restaurant data
   */
  getMyRestaurant: async () => {
    const response = await apiClient.get('/api/restaurants/me');
    return response.data;
  },

  /**
   * Get pending restaurants (for admin)
   * @returns {Promise<Array>} List of pending restaurants
   */
  getPendingRestaurants: async () => {
    const response = await apiClient.get('/api/restaurants/pending');
    return response.data;
  },

  /**
   * Approve restaurant (admin only)
   * @param {number} id - Restaurant ID
   * @returns {Promise<Object>} Updated restaurant
   */
  approveRestaurant: async (id) => {
    const response = await apiClient.put(`/api/restaurants/${id}/approve`);
    return response.data;
  },

  /**
   * Reject restaurant (admin only)
   * @param {number} id - Restaurant ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Response
   */
  rejectRestaurant: async (id, reason) => {
    const response = await apiClient.put(`/api/restaurants/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Delete restaurant
   * @param {number} id - Restaurant ID
   * @returns {Promise<void>}
   */
  deleteRestaurant: async (id) => {
    const response = await apiClient.delete(`/api/restaurants/${id}`);
    return response.data;
  }
};

export default restaurantService;
