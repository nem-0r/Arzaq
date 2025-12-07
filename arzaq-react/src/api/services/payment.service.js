// src/api/services/payment.service.js
import apiClient from '../client';

/**
 * Payment Service - управление платежами
 */
const paymentService = {
  /**
   * Initiate PayBox payment
   * @param {number} orderId
   * @returns {Promise<{payment_url: string, payment_id: string}>} Payment URL and ID
   */
  async initiatePayment(orderId) {
    try {
      const response = await apiClient.post('/api/payments/initiate', {
        order_id: orderId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw error;
    }
  },

  /**
   * Get payment status for an order
   * @param {number} orderId
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`/api/payments/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }
};

export default paymentService;
