import api from './client';
import {
  Accident,
  AccidentData,
  AccidentStatisticsDTO,
  AccidentStatisticsParams,
  AccidentAnalysis,
  DrunkDrivingStats
  // Removed AccidentType, AccidentRole as they are no longer exported from types
} from '../../types/accidents';

export const getAccidents = async (): Promise<Accident[]> => {
  const response = await api.get<Accident[]>('/accidents');
  return response.data;
};

export const addAccident = async (data: AccidentData): Promise<void> => {
  await api.post('/accidents', data);
};

export const getAccidentStatistics = async (params: AccidentStatisticsParams): Promise<AccidentStatisticsDTO[]> => {
  const response = await api.get<AccidentStatisticsDTO[]>('/accidents/statistics', { params });
  return response.data;
};

export const getAccidentStatisticsByCause = async (params: AccidentStatisticsParams): Promise<AccidentStatisticsDTO[]> => {
  const response = await api.get<AccidentStatisticsDTO[]>('/accidents/statistics-by-cause', { params });
  return response.data;
};

export const getAccidentAnalysis = async (): Promise<AccidentAnalysis> => {
  const response = await api.get<AccidentAnalysis>('/accidents/analysis');
  return response.data;
};

export const getDrunkDrivingStats = async (): Promise<DrunkDrivingStats> => {
  const response = await api.get<DrunkDrivingStats>('/accidents/drunk-driving-stats');
  return response.data;
};

export const addAccidentParticipant = async (accidentId: number, data: {
  ownerId: number;
  role: string;
}): Promise<void> => {
  await api.post(`/accidents/${accidentId}/participants`, data);
};

export const getAccidentTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/accidents/accident-types');
  return response.data;
};

export const getAccidentRoles = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/accidents/accident-roles');
  return response.data;
};

export const getAccidentCauses = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/accidents/accident-causes');
  return response.data;
};
