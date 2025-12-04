// src/api/services/food.service.js
import apiClient from '../client';

const foodService = {
  /**
   * Create a new food item
   * @param {Object} foodData - Food information
   * @returns {Promise<Object>} Created food item
   */
  createFood: async (foodData) => {
    const response = await apiClient.post('/api/foods', foodData);
    return response.data;
  },

  /**
   * Get all food items (with optional filters)
   * @param {Object} params - Filter parameters (restaurant_id, status, etc.)
   * @returns {Promise<Array>} List of food items
   */
  getAllFoods: async (params = {}) => {
    const response = await apiClient.get('/api/foods', { params });
    return response.data;
  },

  /**
   * Get food item by ID
   * @param {number} id - Food item ID
   * @returns {Promise<Object>} Food item details
   */
  getFoodById: async (id) => {
    const response = await apiClient.get(`/api/foods/${id}`);
    return response.data;
  },

  /**
   * Get foods by restaurant ID
   * @param {number} restaurantId - Restaurant ID
   * @returns {Promise<Array>} List of food items
   */
  getFoodsByRestaurant: async (restaurantId) => {
    const response = await apiClient.get('/api/foods', {
      params: { restaurant_id: restaurantId }
    });
    return response.data;
  },

  /**
   * Get current restaurant's food items
   * @returns {Promise<Array>} List of food items
   */
  getMyFoods: async () => {
    const response = await apiClient.get('/api/foods/me');
    return response.data;
  },

  /**
   * Update food item
   * @param {number} id - Food item ID
   * @param {Object} foodData - Updated data
   * @returns {Promise<Object>} Updated food item
   */
  updateFood: async (id, foodData) => {
    const response = await apiClient.put(`/api/foods/${id}`, foodData);
    return response.data;
  },

  /**
   * Delete food item
   * @param {number} id - Food item ID
   * @returns {Promise<void>}
   */
  deleteFood: async (id) => {
    const response = await apiClient.delete(`/api/foods/${id}`);
    return response.data;
  },

  /**
   * Upload food image
   * @param {File} file - Image file
   * @returns {Promise<Object>} Upload result with URL
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/api/foods/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Search foods by name or description
   * @param {string} query - Search query
   * @returns {Promise<Array>} List of matching food items
   */
  searchFoods: async (query) => {
    const response = await apiClient.get('/api/foods/search', {
      params: { q: query }
    });
    return response.data;
  }
};

export default foodService;
