import { PageResponse } from '@/types';
import apiClient from './client';

export interface AlarmSystem {
  id: number;
  name: string;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const getAlarmSystems = async (params: { 
  search?: string; 
  page?: number; 
  limit?: number 
}): Promise<PageResponse<AlarmSystem>> => {
  const response = await apiClient.get<PageResponse<AlarmSystem>>('/alarm-systems', { params });
  return response.data;
};

export const getMostReliableAlarmSystems = () =>
  apiClient.get<Array<{alarmSystem: string; theftCount: number}>>('/alarm-systems/reliable');
