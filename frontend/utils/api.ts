import axios from 'axios';
import { LicensePlate } from '../types/type';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export interface AccidentData {
  date: string;
  location: { lat: number; lng: number };
  type: string;
  briefDescription: string;
  numberOfVictims: number;
  damageAmount: number;
  reason: string;
  roadConditions: string;
}

export const addAccident = (data: AccidentData) => apiClient.post('/accidents', data);
export const addAccidentParticipant = (id:number, data: any) => apiClient.post(`/accident/${id}/partitions`, data)

export interface OwnerData {
  fullName: string;
  address: string;
  phone: string;
}

export const getOwners = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/owners', { params });
export const addOwner = (data: OwnerData) => apiClient.post('/owners', data);

export interface OrganizationData {
  name: string;
  district: string;
  address: string;
  director: string;
}

export const getOrganizations = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/organizations', { params });
export const addOrganization = (data: OrganizationData) => apiClient.post('/organizations', data);


export interface SalePurchaseData {
  vehicleId: number;
  date: string;
  cost: number;
  buyerId: number;
  sellerId: number;
}

export const addSalePurchase = (data: SalePurchaseData) => apiClient.post('/sales-purchases', data);

// Vehicles
export interface VehicleData {
  brandId: number;
  alarmSystemId: number;
  ownerId: number;
  organizationId: number;
  licensePlateId: number;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
}

export const getVehicles = (params: { type?: string; ownerId?: number; page?: number; limit?: number }) =>
  apiClient.get('/vehicles', { params });
export const addVehicle = (data: VehicleData) => apiClient.post('/vehicles', data);



export const getBrands = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/brands', { params });

export const getAlarmSystems = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/alarm-systems', { params });

export const getLicensePlates = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/license-plates', { params });

export interface WantedVehicleData {
  vehicleId: number;
  addedDate: string;
  reason: string;
  status: string;
}

export const addWanted = (data: WantedVehicleData) => apiClient.post('/wanted', data);

export const getInspections = (params: { page?: number; limit?: number }) => apiClient.get('/inspection', { params });
export const addInspection = (data: any) => apiClient.post('/inspection', data);

export const validateLicensePlate = (licenseNumber: string) =>
  apiClient.get<boolean>(`/license-plates/validate/${licenseNumber}`);
export const getHotLicensePlates = () =>
  apiClient.get<LicensePlate[]>('/license-plates/hot');