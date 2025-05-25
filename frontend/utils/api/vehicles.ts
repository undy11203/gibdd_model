import api from './client';
import { Brand } from "../../types/brand";
import { Vehicle, VehicleData, VehicleDossierDTO } from '../../types/vehicles'; // Added VehicleDossierDTO
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

export const getVehicleDossierByLicensePlate = async (licenseNumber: string): Promise<VehicleDossierDTO> => {
  const response = await api.get<VehicleDossierDTO>(`/vehicles/dossier-by-license`, { 
    params: { licenseNumber } 
  });
  return response.data;
};

export const getVehicleTypeValues = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/vehicles/vehicle-types'); // Expects string[][]
  return response.data && response.data.length > 0 ? response.data : []; // Return first element
};
