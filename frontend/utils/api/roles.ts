import api from './client';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest
} from '../../types/auth';

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>('/admin/roles');
  return response.data;
};

export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
  const response = await api.post<Role>('/admin/roles', data);
  return response.data;
};

export const updateRole = async (roleId: number, data: UpdateRoleRequest): Promise<Role> => {
  const response = await api.put<Role>(`/admin/roles/${roleId}`, data);
  return response.data;
};

export const deleteRole = async (roleId: number): Promise<void> => {
  await api.delete(`/admin/roles/${roleId}`);
};

export const getAllPermissions = async (): Promise<Permission[]> => {
  const response = await api.get<Permission[]>('/admin/roles/permissions');
  return response.data;
};

export const createPermission = async (data: CreatePermissionRequest): Promise<Permission> => {
  const response = await api.post<Permission>('/admin/roles/permissions', data);
  return response.data;
};

export const deletePermission = async (permissionId: number): Promise<void> => {
  await api.delete(`/admin/roles/permissions/${permissionId}`);
};
