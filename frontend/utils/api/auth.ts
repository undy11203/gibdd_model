import { AxiosError } from 'axios';
import api from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Permission
} from '../../types/auth';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  const authData = response.data;
  if (authData.token) {
    localStorage.setItem('token', authData.token);
  }
  return authData;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Even if the logout request fails, we want to clear local state
    console.error('Error during logout:', error);
  }
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    // Try to get current user permissions as a way to verify auth
    await api.get<Permission[]>('/admin/roles/current-user/permissions');
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
    }
    // For other errors (like network issues), assume token is valid
    // to prevent unnecessary logouts
    return true;
  }
};

export const getCurrentUserPermissions = async (): Promise<Permission[]> => {
  const response = await api.get<Permission[]>('/admin/roles/current-user/permissions');
  return response.data;
};

export const checkPermission = async (resource: string, action: string): Promise<boolean> => {
  const response = await api.get<boolean>('/admin/roles/check-permission', {
    params: { resource, action }
  });
  return response.data;
};
