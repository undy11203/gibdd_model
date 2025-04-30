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
  return response.data;
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    await api.get('/auth/check');
    return true;
  } catch {
    return false;
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
