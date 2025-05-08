import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse } from '../types/auth';
import { checkAuth } from '../utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  token: string | null;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Set initial state from localStorage
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Set cookie for middleware
          document.cookie = `token=${storedToken}; path=/`;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear everything on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (response: AuthResponse) => {
    // Set cookie for middleware
    document.cookie = `token=${response.token}; path=/`;
    
    // Store in localStorage for app state
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    
    setToken(response.token);
    setUser(response);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove cookie for middleware
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
