import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  // Check authentication on mount
  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Register user
  const register = useCallback((userData) => {
    const { fullName, email, password } = userData;

    // Check if user already exists
    const existingUser = localStorage.getItem('user_' + email);
    if (existingUser) {
      throw new Error('error_email_exists');
    }

    // Save user data
    const newUser = {
      fullName,
      email,
      password, // In production, this should be hashed on backend!
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('user_' + email, JSON.stringify(newUser));

    // BACKEND NOTE: Replace with API call
    /*
    const response = await fetch('YOUR_API_URL/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    */

    return true;
  }, []);

  // Login user
  const login = useCallback((email, password) => {
    const userDataString = localStorage.getItem('user_' + email);

    if (!userDataString) {
      throw new Error('error_email_notfound');
    }

    const userData = JSON.parse(userDataString);

    if (userData.password !== password) {
      throw new Error('error_password_incorrect');
    }

    // Create session
    const session = {
      fullName: userData.fullName,
      email: userData.email,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(session));
    setCurrentUser(session);
    setIsAuthenticated(true);

    // BACKEND NOTE: Replace with API call
    /*
    const response = await fetch('YOUR_API_URL/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    */

    return true;
  }, []);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    // localStorage.removeItem('authToken'); // For backend integration
    setCurrentUser(null);
    setIsAuthenticated(false);

    // BACKEND NOTE: Call logout endpoint
    /*
    await fetch('YOUR_API_URL/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    */
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};