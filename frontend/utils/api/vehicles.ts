import api from './client';
import { Vehicle, VehicleData, Brand } from '../../types/vehicles';
import { PageResponse } from '../../types/common';

interface VehicleQueryParams {
  type?: string;
  ownerId?: number;
  page?: number;
  limit?: number;
}

export const getVehicles = async (params?: VehicleQueryParams): Promise<PageResponse<Vehicle>> => {
  const response = await api.get<PageResponse<Vehicle>>('/vehicles', { params });
  return response.data;
};

export const addVehicle = async (data: VehicleData): Promise<Vehicle> => {  
  const response = await api.post<Vehicle>('/vehicles', data);
  return response.data;
};

export const getVehicleByLicensePlate = async (licensePlate: string): Promise<Vehicle> => {
  const response = await api.get<Vehicle>(`/vehicles/by-license-plate/${licensePlate}`);
  return response.data;
};

export const getVehicleDossierByLicensePlate = async (licenseNumber: string) => {
  const response = await api.get(`/vehicles/dossier-by-license`, { 
    params: { licenseNumber } 
  });
  return response.data;
};

export const getBrands = async (params: { 
  search?: string; 
  page?: number; 
  limit?: number 
}): Promise<PageResponse<Brand>> => {
  const response = await api.get<PageResponse<Brand>>('/brands', { params });
  return response.data;
};
