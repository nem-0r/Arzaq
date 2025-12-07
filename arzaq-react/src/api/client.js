// src/api/client.js
import axios from 'axios';

// Production и Development URL
const PRODUCTION_API_URL = 'https://arzaq-production.up.railway.app';
const DEVELOPMENT_API_URL = 'http://localhost:8000';

// Определяем режим (development или production)
const isDevelopment = import.meta.env.MODE === 'development';

// Получаем базовый URL: приоритет env переменной, затем production/development URL
let API_BASE_URL = import.meta.env.VITE_API_URL || (isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL);

// ВАЖНО: Принудительно заменяем http:// на https:// для Railway URL
if (API_BASE_URL.includes('railway.app') && API_BASE_URL.startsWith('http://')) {
  API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
}

// DEBUG: Показываем какой API URL используется
console.log('🔧 MODE:', import.meta.env.MODE);
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 VITE_API_URL from env:', import.meta.env.VITE_API_URL);

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 секунд
});

// Request Interceptor - добавляем JWT токен к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // КРИТИЧЕСКИ ВАЖНО: Принудительно заменяем HTTP на HTTPS для Railway
    // Это защита на случай если baseURL был создан с HTTP (из-за кэша или старого билда)
    if (config.baseURL && config.baseURL.includes('railway.app') && config.baseURL.startsWith('http://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://');
      console.warn('⚠️ Forced HTTPS replacement in interceptor:', config.baseURL);
    }

    // DEBUG: Показываем полный URL запроса
    console.log('🔍 Request URL:', config.baseURL + config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - обрабатываем ошибки глобально
apiClient.interceptors.response.use(
  (response) => {
    // Успешный ответ - просто возвращаем данные
    return response;
  },
  (error) => {
    // Обработка ошибок
    if (error.response) {
      // Сервер вернул ошибку
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - токен невалидный или истек
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');

          // Перенаправляем на страницу логина только если не находимся на публичной странице
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - нет прав доступа
          console.error('Access forbidden:', data);
          break;

        case 404:
          // Not Found
          console.error('Resource not found:', data);
          break;

        case 409:
          // Conflict (например, email уже существует)
          console.error('Conflict:', data);
          break;

        case 500:
          // Server Error
          console.error('Server error:', data);
          break;

        default:
          console.error('API Error:', data);
      }

      // Пробрасываем ошибку дальше с дополнительной информацией
      return Promise.reject({
        status,
        message: data.detail || data.message || 'An error occurred',
        data
      });
    } else if (error.request) {
      // Запрос был отправлен, но ответа нет (сетевая ошибка)
      console.error('Network error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null
      });
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
        data: null
      });
    }
  }
);

export default apiClient;
