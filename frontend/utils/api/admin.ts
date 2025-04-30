import api from './client';
import { 
  SqlQueryRequest, 
  SqlQueryResponse, 
  TheftStatistics,
  TheftListParams,
  TheftInfo
} from '../../types/admin';
import { PageResponse } from '../../types/common';

export const executeRawQuery = async (query: string): Promise<SqlQueryResponse> => {
  const response = await api.post<SqlQueryResponse>('/admin/execute-query', { query });
  return response.data;
};

export const getTheftList = async (params: TheftListParams): Promise<PageResponse<TheftInfo>> => {
  const response = await api.get<PageResponse<TheftInfo>>('/thefts', { params });
  return response.data;
};

export const getTheftStatistics = async (params: { 
  startDate: string; 
  endDate: string; 
}): Promise<TheftStatistics> => {
  const response = await api.get<TheftStatistics>('/thefts/statistics', { params });
  return response.data;
};
