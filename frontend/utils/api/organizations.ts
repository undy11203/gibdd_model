import api from './client';
import {
  Organization,
  OrganizationData,
  OrganizationNumberFilterParams,
  OrganizationResponse
} from '../../types/organizations';

export const getOrganizations = async (params?: { search?: string; page?: number; limit?: number }): Promise<OrganizationResponse> => {
  const response = await api.get<OrganizationResponse>('/organizations', { params });
  return response.data;
};

export const addOrganization = async (data: OrganizationData): Promise<Organization> => {
  const response = await api.post<Organization>('/organizations', data);
  return response.data;
};

export const getOrganizationsByNumberFilter = async (params: OrganizationNumberFilterParams): Promise<OrganizationResponse> => {
  const response = await api.get<OrganizationResponse>('/organizations/number-filter', { params });
  return response.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
  const response = await api.get<Organization>(`/organizations/${id}`);
  return response.data;
};
