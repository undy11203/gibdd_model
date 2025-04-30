import api from './client';
import { 
  TechnicalInspection, 
  InspectionData,
  InspectionResponse,
  OverdueInspectionInfo
} from '../../types/inspections';

interface InspectionQueryParams {
  page?: number;
  limit?: number;
}

export const getInspections = async (params?: InspectionQueryParams): Promise<InspectionResponse> => {
  const response = await api.get<InspectionResponse>('/inspection', { params });
  return response.data;
};

export const addInspection = async (data: InspectionData): Promise<TechnicalInspection> => {
  const response = await api.post<TechnicalInspection>('/inspection', data);
  return response.data;
};

export const getOverdueInspections = async (): Promise<OverdueInspectionInfo[]> => {
  const response = await api.get<OverdueInspectionInfo[]>('/inspection/overdue');
  return response.data;
};

export const getInspectionById = async (id: number): Promise<TechnicalInspection> => {
  const response = await api.get<TechnicalInspection>(`/inspection/${id}`);
  return response.data;
};

export const updateInspection = async (id: number, data: InspectionData): Promise<TechnicalInspection> => {
  const response = await api.put<TechnicalInspection>(`/inspection/${id}`, data);
  return response.data;
};

export const deleteInspection = async (id: number): Promise<void> => {
  await api.delete(`/inspection/${id}`);
};
