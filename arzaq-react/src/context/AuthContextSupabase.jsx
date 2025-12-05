// src/context/AuthContext.jsx - Updated for Supabase OAuth
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services';
import { supabase, getSession, signOut as supabaseSignOut, onAuthStateChange } from '../lib/supabase';

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
  const [supabaseSession, setSupabaseSession] = useState(null);

  // Initialize auth - check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for Supabase session first
        const session = await getSession();

        if (session) {
          setSupabaseSession(session);
          // Get user data from our backend using Supabase token
          await syncUserWithBackend(session);
        } else {
          // Check for JWT token (regular login)
          const token = authService.getToken();
          if (token) {
            try {
              const userData = await authService.getCurrentUser();
              setCurrentUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem('currentUser', JSON.stringify(userData));
            } catch (error) {
              console.error('Error loading user data:', error);
              authService.logout();
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for Supabase auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Supabase auth event:', event);

      if (event === 'SIGNED_IN' && session) {
        setSupabaseSession(session);
        await syncUserWithBackend(session);
      } else if (event === 'SIGNED_OUT') {
        setSupabaseSession(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sync Supabase user with our backend
   * This sends Supabase session to our FastAPI backend
   * Backend will verify the Supabase JWT and create/login user
   */
  const syncUserWithBackend = async (session) => {
    try {
      const supabaseUser = session.user;

      // Send Supabase user data to our backend
      // Backend will create user if not exists or return existing user
      const response = await authService.supabaseAuth({
        email: supabaseUser.email,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
        google_id: supabaseUser.id,
        supabase_token: session.access_token,
        // Role will be determined on first registration or from DB
        role: localStorage.getItem('pending_role') || 'client'
      });

      // Clear pending role
      localStorage.removeItem('pending_role');

      setCurrentUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      // Store JWT token from our backend
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
    } catch (error) {
      console.error('Error syncing with backend:', error);
      throw error;
    }
  };

  // Register user - standard email/password
  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Login user - standard email/password
  const login = useCallback(async (email, password) => {
    try {
      const { token } = await authService.login(email, password);
      const userData = await authService.getCurrentUser();

      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      // Sign out from Supabase if session exists
      if (supabaseSession) {
        await supabaseSignOut();
      }

      // Clear local auth
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSupabaseSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear even if error
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSupabaseSession(null);
    }
  }, [supabaseSession]);

  // Store role for registration via Google
  const setRegistrationRole = useCallback((role) => {
    localStorage.setItem('pending_role', role);
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    setRegistrationRole,
    supabaseSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
