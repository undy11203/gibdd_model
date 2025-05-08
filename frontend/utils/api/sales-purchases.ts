import apiClient from './client';

export interface SalePurchaseData {
  vehicleId: number;
  date: string;
  cost: number;
  buyerId: number;
  sellerId: number;
}

export const addSalePurchase = (data: SalePurchaseData) =>
  apiClient.post('/sales-purchases', data);

export const getSalePurchases = () =>
  apiClient.get('/sales-purchases');
