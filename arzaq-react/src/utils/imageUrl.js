// src/utils/imageUrl.js
import { API_BASE_URL } from '../api/config';

/**
 * Convert a relative image path to an absolute URL
 * @param {string|null} imagePath - Relative image path from API (e.g., "/uploads/foods/image.jpg")
 * @param {string} fallback - Fallback image path if imagePath is null/empty
 * @returns {string} Absolute image URL or fallback
 */
export const getImageUrl = (imagePath, fallback = '/placeholder-food.jpg') => {
  if (!imagePath) {
    return fallback;
  }

  // If already an absolute URL (http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path, prepend the API base URL
  // Remove leading slash from imagePath if API_BASE_URL already has trailing slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${path}`;
};

/**
 * Get full URL for food image
 * @param {Object} food - Food object from API
 * @returns {string} Full image URL
 */
export const getFoodImageUrl = (food) => {
  return getImageUrl(food?.image, '/placeholder-food.jpg');
};
