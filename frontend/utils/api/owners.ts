import api from './client';
import { Owner, OwnerData } from '../../types/owners';
import { PageResponse } from '../../types/common';

interface OwnerQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getOwners = async (params?: OwnerQueryParams): Promise<PageResponse<Owner>> => {
  const response = await api.get<PageResponse<Owner>>('/owners', { params });
  return response.data;
};

export const addOwner = async (data: OwnerData): Promise<Owner> => {
  const response = await api.post<Owner>('/owners', data);
  return response.data;
};

export const getOwnerByLicenseNumber = async (licenseNumber: string) => {
  const response = await api.get('/owner-by-license', { 
    params: { licenseNumber } 
  });
  return response.data;
};

export const getOwnerById = async (id: number): Promise<Owner> => {
  const response = await api.get<Owner>(`/owners/${id}`);
  return response.data;
};

export const updateOwner = async (id: number, data: OwnerData): Promise<Owner> => {
  const response = await api.put<Owner>(`/owners/${id}`, data);
  return response.data;
};

export const deleteOwner = async (id: number): Promise<void> => {
  await api.delete(`/owners/${id}`);
};
