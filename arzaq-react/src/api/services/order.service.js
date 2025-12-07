// src/api/services/order.service.js
import apiClient from '../client';

/**
 * Order Service - управление заказами
 */
const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - {items: [{food_id, quantity}], notes}
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  /**
   * Get all user's orders
   * @returns {Promise<Array>} List of orders
   */
  async getMyOrders() {
    try {
      const response = await apiClient.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    }
  },

  /**
   * Get order by ID
   * @param {number} orderId
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(orderId) {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get order:', error);
      throw error;
    }
  },

  /**
   * Get restaurant's orders (for restaurant dashboard)
   * @param {string} statusFilter - Optional status filter
   * @returns {Promise<Array>} List of orders
   */
  async getRestaurantOrders(statusFilter = null) {
    try {
      const params = {};
      if (statusFilter) {
        params.status_filter = statusFilter;
      }
      const response = await apiClient.get('/api/orders/restaurant/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get restaurant orders:', error);
      throw error;
    }
  },

  /**
   * Update order status (restaurant only)
   * @param {number} orderId
   * @param {string} newStatus - "confirmed" or "ready"
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await apiClient.put(
        `/api/orders/${orderId}/restaurant-update`,
        null,
        { params: { new_status: newStatus } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

  /**
   * Verify pickup code and complete order (restaurant QR scanner)
   * @param {string} pickupCode
   * @returns {Promise<Object>} Verification result
   */
  async verifyPickupCode(pickupCode) {
    try {
      const response = await apiClient.post('/api/orders/verify-pickup', {
        pickup_code: pickupCode
      });
      return response.data;
    } catch (error) {
      console.error('Failed to verify pickup code:', error);
      throw error;
    }
  }
};

export default orderService;
