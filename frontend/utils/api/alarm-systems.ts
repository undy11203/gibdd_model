import { PageResponse } from '@/types';
import api from './client';
import { AlarmSystem } from '@/types/alarm-systems';

export const getAlarmSystems = async (params: { 
  search?: string; 
  page?: number; 
  limit?: number 
}): Promise<PageResponse<AlarmSystem>> => {
  const response = await api.get<PageResponse<AlarmSystem>>('/alarm-systems', { params });
  return response.data;
};

export const getMostReliableAlarmSystems = () =>
  api.get<Array<{alarmSystem: string; theftCount: number}>>('/alarm-systems/reliable');

export const getAlarmSystemReliabilityValues = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/alarm-systems/alarm-systems-reliable');
  return response.data && response.data.length > 0 ? response.data : [];
};

// Получение системы сигнализации по ID
export const getAlarmSystemById = async (id: number): Promise<AlarmSystem> => {
  const response = await api.get<AlarmSystem>(`/alarm-systems/${id}`);
  return response.data;
};

// Создание новой системы сигнализации
export const createAlarmSystem = async (alarmSystem: AlarmSystem): Promise<AlarmSystem> => {
  const response = await api.post<AlarmSystem>('/alarm-systems', alarmSystem);
  return response.data;
};

// Обновление существующей системы сигнализации
export const updateAlarmSystem = async (id: number, alarmSystem: Partial<AlarmSystem>): Promise<AlarmSystem> => {
  const response = await api.post<AlarmSystem>(`/alarm-systems/${id}`, alarmSystem);
  return response.data;
};

// Удаление системы сигнализации по ID
export const deleteAlarmSystem = async (id: number): Promise<void> => {
  await api.delete(`/alarm-systems/${id}`);
};