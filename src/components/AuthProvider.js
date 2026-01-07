/**
 * AuthProvider.js
 * Context provider for authentication state management
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import OdooAPI from '../utils/OdooAPI';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // Initialize API with config
      await OdooAPI.initialize({});
      
      // Check if user is authenticated
      const authenticated = OdooAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Optionally fetch user details
        setUser({ uid: OdooAPI.uid, db: OdooAPI.db });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password, db) => {
    try {
      setIsLoading(true);
      const result = await OdooAPI.login(username, password, db);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser({ uid: OdooAPI.uid, db: OdooAPI.db });
        return { success: true };
      } else {
        return { success: false, message: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await OdooAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;