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
  const response = await api.get<InspectionResponse>('/inspections', { params });
  return response.data;
};

export const addInspection = async (data: InspectionData): Promise<TechnicalInspection> => {
  const response = await api.post<TechnicalInspection>('/inspections', data);
  return response.data;
};

export const getOverdueInspections = async (): Promise<OverdueInspectionInfo[]> => {
  const response = await api.get<OverdueInspectionInfo[]>('/owners/overdue-inspections');
  return response.data;
};

export const getInspectionById = async (id: number): Promise<TechnicalInspection> => {
  const response = await api.get<TechnicalInspection>(`/inspections/${id}`);
  return response.data;
};

export const updateInspection = async (id: number, data: InspectionData): Promise<TechnicalInspection> => {
  const response = await api.put<TechnicalInspection>(`/inspections/${id}`, data);
  return response.data;
};

export const deleteInspection = async (id: number): Promise<void> => {
  await api.delete(`/inspections/${id}`);
};
