import apiClient from './client';

export interface SalePurchaseData {
  vehicleId: number;
  date: string;
  cost: number;
  buyerId: number;
  sellerId: number;
}

export interface SalePurchase {
  id: number;
  date: string;
  cost: number;
  vehicle: {
    id: number;
    model: string;
    licensePlate: {
      licenseNumber: string;
      number: number;
      series: string;
      status: boolean;
      date: string;
    };
  };
  buyer: {
    id: number;
    fullName: string;
  };
  seller: {
    id: number;
    fullName: string;
  };
}

export const addSalePurchase = (data: SalePurchaseData) =>
  apiClient.post('/sales-purchases', data);

export const getSalePurchases = () =>
  apiClient.get<SalePurchase[]>('/sales-purchases');

export const deleteSalePurchase = (id: number) =>
  apiClient.delete(`/sales-purchases/${id}`);

export const updateSalePurchase = (id: number, data: SalePurchaseData) =>
  apiClient.put(`/sales-purchases/${id}`, data);
