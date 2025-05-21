import api from './client';
import { 
  LicensePlate, 
  FreeLicensePlateRange,
  LicensePlateValidationResponse
} from '../../types/license-plates';
import { PageResponse } from '../../types/common';

interface LicensePlateQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getLicensePlates = async (params?: LicensePlateQueryParams): Promise<PageResponse<LicensePlate>> => {
  const response = await api.get<PageResponse<LicensePlate>>('/license-plates', { params });
  return response.data;
};

export const validateLicensePlate = async (licenseNumber: string): Promise<boolean> => {
  try {
    const response = await api.get<LicensePlateValidationResponse>(`/license-plates/validate/${licenseNumber}`);
    return response.data.isValid;
  } catch (error) {
    console.error("Error validating license plate:", error);
    return false;
  }
};

export const getHotLicensePlates = async (): Promise<LicensePlate[]> => {
  const response = await api.get<LicensePlate[]>('/license-plates/hot');
  return response.data;
};

export const getFreeLicensePlateRanges = async (): Promise<FreeLicensePlateRange[]> => {
  const response = await api.get<FreeLicensePlateRange[]>('/license-plates/free-ranges');
  return response.data;
};

export const assignLicensePlate = async (vehicleId: number, licensePlateId: number): Promise<void> => {
  await api.post(`/license-plates/${licensePlateId}/assign/${vehicleId}`);
};

export const releaseLicensePlate = async (licensePlateId: number): Promise<void> => {
  await api.post(`/license-plates/${licensePlateId}/release`);
};
