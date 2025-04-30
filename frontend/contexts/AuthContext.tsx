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

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const isValid = await checkAuth();
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch {
          // Error checking token, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();
  }, []);

  const login = (response: AuthResponse) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setToken(response.token);
    setUser(response);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

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
