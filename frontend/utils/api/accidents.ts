import api from './client';
import {
  Accident,
  AccidentData,
  AccidentStatisticsDTO,
  AccidentStatisticsParams,
  AccidentAnalysis,
  DrunkDrivingStats
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
