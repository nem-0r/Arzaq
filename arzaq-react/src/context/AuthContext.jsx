import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services';

export const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount and load user data
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();

      if (token) {
        try {
          // Получаем данные текущего пользователя с бэкенда
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          setIsAuthenticated(true);

          // Сохраняем в localStorage для быстрого доступа
          localStorage.setItem('currentUser', JSON.stringify(userData));
        } catch (error) {
          console.error('Error loading user data:', error);
          // Токен невалидный - очищаем
          authService.logout();
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Register user - теперь использует реальный API
  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      // После регистрации пользователь может войти
      return response;
    } catch (error) {
      // Пробрасываем ошибку дальше для обработки в форме
      throw error;
    }
  }, []);

  // Login user - теперь использует реальный API с JWT
  const login = useCallback(async (email, password) => {
    try {
      // Получаем JWT токен
      const { token } = await authService.login(email, password);

      // Получаем данные пользователя
      const userData = await authService.getCurrentUser();

      // Обновляем состояние
      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Сохраняем в localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return true;
    } catch (error) {
      // Пробрасываем ошибку дальше для обработки в форме
      throw error;
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // Google Login
  const loginWithGoogle = useCallback(async (googleToken) => {
    try {
      // Получаем JWT токен от бэкенда
      const { token } = await authService.googleLogin(googleToken);

      // Получаем данные пользователя
      const userData = await authService.getCurrentUser();

      // Обновляем состояние
      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Сохраняем в localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Google Register
  const registerWithGoogle = useCallback(async (googleToken, role = 'client') => {
    try {
      // Получаем JWT токен от бэкенда
      const { token } = await authService.googleRegister(googleToken, role);

      // Получаем данные пользователя
      const userData = await authService.getCurrentUser();

      // Обновляем состояние
      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Сохраняем в localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    loginWithGoogle,
    registerWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};