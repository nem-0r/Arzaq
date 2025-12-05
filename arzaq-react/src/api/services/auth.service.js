// src/api/services/auth.service.js
import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Auth Service - работа с аутентификацией
 */
const authService = {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - {fullName, email, password}
   * @returns {Promise} User data
   */
  async register(userData) {
    try {
      // Бэкенд ожидает full_name, а не fullName
      const requestData = {
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
      };

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, requestData);
      return response.data;
    } catch (error) {
      // Обрабатываем специфичные ошибки бэкенда
      if (error.status === 409) {
        throw new Error('error_email_exists');
      }
      throw error;
    }
  },

  /**
   * Вход пользователя
   * ВАЖНО: Бэкенд использует OAuth2PasswordRequestForm (form-data), не JSON!
   * @param {string} email
   * @param {string} password
   * @returns {Promise} {access_token, token_type}
   */
  async login(email, password) {
    try {
      // Создаем FormData вместо JSON для OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', email); // OAuth2 использует "username", но мы передаем email
      formData.append('password', password);

      // Отправляем как form-data, а не JSON
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token, token_type } = response.data;

      // Сохраняем токен
      localStorage.setItem('authToken', access_token);

      return {
        token: access_token,
        tokenType: token_type,
      };
    } catch (error) {
      // Обрабатываем ошибки логина
      if (error.status === 401) {
        // Бэкенд возвращает общую ошибку "Incorrect username or password"
        // Мы не знаем точно что неправильно, поэтому выбрасываем общую ошибку
        throw new Error('error_login_failed');
      }
      throw error;
    }
  },

  /**
   * Получение информации о текущем пользователе
   * @returns {Promise} User data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      if (error.status === 401) {
        // Токен невалидный - выходим
        this.logout();
        throw new Error('error_unauthorized');
      }
      throw error;
    }
  },

  /**
   * Выход пользователя
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  /**
   * Проверка, авторизован ли пользователь
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Получение токена
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Вход через Google OAuth
   * @param {string} googleToken - Access token от Google
   * @returns {Promise} {access_token, token_type}
   */
  async googleLogin(googleToken) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        token: googleToken,
      });

      const { access_token, token_type } = response.data;

      // Сохраняем токен
      localStorage.setItem('authToken', access_token);

      return {
        token: access_token,
        tokenType: token_type,
      };
    } catch (error) {
      if (error.status === 401) {
        throw new Error('error_google_login_failed');
      }
      if (error.status === 404) {
        throw new Error('error_google_user_not_found');
      }
      throw error;
    }
  },

  /**
   * Регистрация через Google OAuth
   * @param {string} googleToken - Access token от Google
   * @param {string} role - Роль пользователя (client или restaurant)
   * @returns {Promise} {access_token, token_type}
   */
  async googleRegister(googleToken, role = 'client') {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_REGISTER, {
        token: googleToken,
        role: role,
      });

      const { access_token, token_type } = response.data;

      // Сохраняем токен
      localStorage.setItem('authToken', access_token);

      return {
        token: access_token,
        tokenType: token_type,
      };
    } catch (error) {
      if (error.status === 409) {
        throw new Error('error_google_user_exists');
      }
      throw error;
    }
  },

  /**
   * Authenticate with Supabase OAuth
   * Send Supabase user data to backend for verification and user creation/login
   * @param {Object} supabaseData - { email, full_name, google_id, supabase_token, role }
   * @returns {Promise} { user, token }
   */
  async supabaseAuth(supabaseData) {
    try {
      const response = await apiClient.post('/api/auth/supabase', supabaseData);

      const { user, token } = response.data;

      // Save JWT token from our backend
      if (token) {
        localStorage.setItem('authToken', token);
      }

      return { user, token };
    } catch (error) {
      if (error.status === 409) {
        throw new Error('error_user_exists');
      }
      throw error;
    }
  },
};

export default authService;
