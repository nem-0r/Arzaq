// src/utils/geocoding.js

import { YANDEX_MAPS_API_KEY } from './constants';

/**
 * Geocode address to coordinates using Yandex Geocoder API
 * @param {string} address - Full address string (e.g., "Al-Farabi 77, Almaty, Kazakhstan")
 * @returns {Promise<{latitude: number, longitude: number}>}
 * @throws {Error} If geocoding fails or address is invalid
 */
export const geocodeAddress = async (address) => {
  // Validate inputs
  if (!address || address.trim().length === 0) {
    throw new Error('Address is required');
  }

  if (!YANDEX_MAPS_API_KEY) {
    throw new Error('Yandex Maps API key is not configured. Please check your .env file.');
  }

  try {
    // Construct Yandex Geocoder API URL
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_MAPS_API_KEY}&geocode=${encodeURIComponent(
      address
    )}&format=json&lang=en_US`;

    // Make API request
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Extract coordinates from response
    const featureMember = data.response?.GeoObjectCollection?.featureMember;

    if (!featureMember || featureMember.length === 0) {
      throw new Error(
        'Address not found. Please enter a more specific address (e.g., "Al-Farabi Avenue 77, Almaty, Kazakhstan")'
      );
    }

    const point = featureMember[0]?.GeoObject?.Point?.pos;

    if (!point) {
      throw new Error('Unable to get coordinates for this address');
    }

    // Parse coordinates (Yandex returns "longitude latitude" format)
    const [longitude, latitude] = point.split(' ').map(Number);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates received from geocoding service');
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Coordinates are out of valid range');
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('Geocoding error:', error);

    // Provide user-friendly error messages
    if (error.message.includes('Address not found')) {
      throw error;
    }

    if (error.message.includes('API key')) {
      throw error;
    }

    // Generic error
    throw new Error(
      'Failed to convert address to coordinates. Please check your internet connection and try again.'
    );
  }
};

/**
 * Validate if address is specific enough for geocoding
 * @param {string} address - Address to validate
 * @returns {{isValid: boolean, message: string}}
 */
export const validateAddressForGeocoding = (address) => {
  if (!address || address.trim().length === 0) {
    return {
      isValid: false,
      message: 'Address is required'
    };
  }

  // Check minimum length
  if (address.trim().length < 10) {
    return {
      isValid: false,
      message: 'Address is too short. Please provide a full address including street, city, and country.'
    };
  }

  // Check if address contains numbers (street numbers)
  if (!/\d/.test(address)) {
    return {
      isValid: false,
      message: 'Please include a street number in your address'
    };
  }

  return {
    isValid: true,
    message: 'Address looks valid'
  };
};
