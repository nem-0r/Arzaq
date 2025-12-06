// src/api/services/restaurantProfile.service.js
import client from '../client';

const restaurantProfileService = {
  /**
   * Create restaurant profile
   * @param {Object} profileData - Restaurant profile data
   * @returns {Promise<Object>} Created profile
   */
  createProfile: async (profileData) => {
    const response = await client.post('/restaurant-profiles/', profileData);
    return response.data;
  },

  /**
   * Get current restaurant's profile
   * @returns {Promise<Object>} Restaurant profile
   */
  getMyProfile: async () => {
    const response = await client.get('/restaurant-profiles/my-profile');
    return response.data;
  },

  /**
   * Update current restaurant's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  updateMyProfile: async (profileData) => {
    const response = await client.put('/restaurant-profiles/my-profile', profileData);
    return response.data;
  },

  /**
   * Get all restaurant profiles
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of restaurant profiles
   */
  getAllProfiles: async (params = {}) => {
    const response = await client.get('/restaurant-profiles/', { params });
    return response.data;
  },

  /**
   * Get restaurant profile by ID
   * @param {number} profileId - Profile ID
   * @returns {Promise<Object>} Restaurant profile
   */
  getProfileById: async (profileId) => {
    const response = await client.get(`/restaurant-profiles/${profileId}`);
    return response.data;
  },

  /**
   * Get pending restaurant profiles (Admin only)
   * @returns {Promise<Array>} List of pending profiles
   */
  getPendingProfiles: async () => {
    const response = await client.get('/restaurant-profiles/pending');
    return response.data;
  },

  /**
   * Approve restaurant profile (Admin only)
   * @param {number} profileId - Profile ID
   * @returns {Promise<Object>} Approved profile
   */
  approveProfile: async (profileId) => {
    const response = await client.put(`/restaurant-profiles/${profileId}/approve`);
    return response.data;
  },

  /**
   * Reject restaurant profile (Admin only)
   * @param {number} profileId - Profile ID
   * @param {string} rejectionReason - Reason for rejection
   * @returns {Promise<Object>} Rejected profile
   */
  rejectProfile: async (profileId, rejectionReason) => {
    const response = await client.put(
      `/restaurant-profiles/${profileId}/reject`,
      null,
      { params: { rejection_reason: rejectionReason } }
    );
    return response.data;
  },

  /**
   * Delete restaurant profile (Admin only)
   * @param {number} profileId - Profile ID
   * @returns {Promise<void>}
   */
  deleteProfile: async (profileId) => {
    await client.delete(`/restaurant-profiles/${profileId}`);
  },
};

export default restaurantProfileService;
