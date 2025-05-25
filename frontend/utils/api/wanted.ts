import api from './client';
import { 
  WantedVehicle, 
  WantedVehicleData, 
  WantedVehicleStats,
  WantedVehicleResponse
  // Removed WantedStatus as it's no longer exported from types
} from '../../types/wanted';

interface WantedVehicleQueryParams {
  reason?: string;
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
}

export const getWantedVehicles = async (params?: WantedVehicleQueryParams): Promise<WantedVehicleResponse> => {
  const response = await api.get<WantedVehicleResponse>('/wanted', { params });
  return response.data;
};

export const addWanted = async (data: WantedVehicleData): Promise<WantedVehicle> => {
  const response = await api.post<WantedVehicle>('/wanted', data);
  return response.data;
};

export const getHitAndRunVehicles = async (): Promise<WantedVehicle[]> => {
  const response = await api.get<WantedVehicle[]>('/wanted/hit-and-run');
  return response.data;
};

export const getStolenVehicles = async (): Promise<WantedVehicle[]> => {
  const response = await api.get<WantedVehicle[]>('/wanted/stolen');
  return response.data;
};

export const getWantedVehicleStats = async (): Promise<WantedVehicleStats> => {
  const response = await api.get<WantedVehicleStats>('/wanted/stats');
  return response.data;
};

export const getFoundVehicles = async (params: { 
  startDate: string; 
  endDate: string; 
}): Promise<WantedVehicle[]> => {
  const response = await api.get<WantedVehicle[]>('/wanted/found', { params });
  return response.data;
};

export const markAsFound = async (id: number, foundDate: string): Promise<WantedVehicle> => {
  const response = await api.put<WantedVehicle>(`/wanted/${id}/found`, null, { 
    params: { foundDate } 
  });
  return response.data;
};

export const getWantedStatusValues = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/wanted/wanted-status');
  return response.data && response.data.length > 0 ? response.data : [];
};
