// src/api/config.js

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    GOOGLE_LOGIN: '/api/auth/google/login',
    GOOGLE_REGISTER: '/api/auth/google/register',
  },

  // User endpoints
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
  },

  // Place endpoints
  PLACES: {
    BASE: '/api/places',
    BY_ID: (id) => `/api/places/${id}`,
  },

  // Post endpoints
  POSTS: {
    BASE: '/api/posts',
    BY_ID: (id) => `/api/posts/${id}`,
  },

  // Comment endpoints
  COMMENTS: {
    BASE: '/api/comments',
    BY_ID: (id) => `/api/comments/${id}`,
    BY_PLACE: (placeId) => `/api/comments?place_id=${placeId}`,
  },
};

// API Base URL (из переменных окружения)
let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ВАЖНО: Принудительно заменяем http:// на https:// для production
if (baseUrl.includes('railway.app') && baseUrl.startsWith('http://')) {
  baseUrl = baseUrl.replace('http://', 'https://');
}

export const API_BASE_URL = baseUrl;
