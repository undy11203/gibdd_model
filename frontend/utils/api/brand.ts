import { PageResponse } from "@/types";
import { Brand } from "@/types/brand";
import api from "./client";

export const getBrands = async (params: { 
  search?: string; 
  page?: number; 
  limit?: number 
}): Promise<PageResponse<Brand>> => {
  const response = await api.get<PageResponse<Brand>>('/brands', { params });
  return response.data;
};

export const getBrandTheftPopularityValues = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/brands/theft-popularity'); // Expects string[][]
  return response.data && response.data.length > 0 ? response.data : []; // Return first element
};

// Получение бренда по ID
export const getBrandById = async (id: number): Promise<Brand> => {
  const response = await api.get<Brand>(`/brands/${id}`);
  return response.data;
};

// Создание нового бренда
export const createBrand = async (brand: Brand): Promise<Brand> => {
  const response = await api.post<Brand>('/brands', brand);
  return response.data;
};

// Обновление существующего бренда
export const updateBrand = async (id: number, brand: Partial<Brand>): Promise<Brand> => {
  const response = await api.post<Brand>(`/brands/${id}`, brand);
  return response.data;
};

// Удаление бренда по ID
export const deleteBrand = async (id: number): Promise<void> => {
  await api.delete(`/brands/${id}`);
};
