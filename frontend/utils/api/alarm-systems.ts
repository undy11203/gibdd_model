import apiClient from './client';

export interface AlarmSystem {
  id: number;
  name: string;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const getAlarmSystems = (params?: { search?: string }) =>
  apiClient.get<AlarmSystem[]>('/alarm-systems', { params });

export const getMostReliableAlarmSystems = () =>
  apiClient.get<Array<{alarmSystem: string; theftCount: number}>>('/alarm-systems/reliable');
