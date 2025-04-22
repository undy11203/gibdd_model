import axios from 'axios';
import { LicensePlate } from '../types/type';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

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

export interface VehicleUpdateData {
  brandId: number;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
  licensePlate: string;
  ownerId: number;
  organizationId: number;
  alarmSystemId: number;
}

export const getVehicles = (params: { type?: string; ownerId?: number; page?: number; limit?: number }) =>
  apiClient.get('/vehicles', { params });

export const addVehicle = (data: VehicleData) => apiClient.post('/vehicles', data);

export const getVehicleById = (id: string) => apiClient.get(`/vehicles/${id}`);

export const updateVehicle = (id: string, data: VehicleUpdateData) => apiClient.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id: string) => apiClient.delete(`/vehicles/${id}`);

// Sales
export const getSales = () => apiClient.get('/sales');

// Organizations
export interface OrganizationData {
  name: string;
  district: string;
  address: string;
  director: string;
}

export const getOrganizations = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/organizations', { params });

export const addOrganization = (data: OrganizationData) => apiClient.post('/organizations', data);

export const getOrganizationById = (id: string) => apiClient.get(`/organizations/${id}`);

export const updateOrganization = (id: string, data: OrganizationData) => apiClient.put(`/organizations/${id}`, data);

export const deleteOrganization = (id: string) => apiClient.delete(`/organizations/${id}`);

// Accidents
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

export const getAccidents = (params: { dateFrom?: string; dateTo?: string; type?: string; page?: number; limit?: number }) =>
  apiClient.get('/accidents', { params });

export const addAccident = (data: AccidentData) => apiClient.post('/accidents', data);

export const getAccidentById = (id: string) => apiClient.get(`/accidents/${id}`);

export const updateAccident = (id: string, data: AccidentData) => apiClient.put(`/accidents/${id}`, data);

export const deleteAccident = (id: string) => apiClient.delete(`/accidents/${id}`);

export const getAccidentsStats = () => apiClient.get('/accidents/stats');

// Wanted Vehicles
export interface WantedVehicleData {
  vehicleId: number;
  additionDate: string;
  reason: string;
  status: string;
}

export const getWanted = (params?: { status?: string; page?: number; limit?: number }) =>
  apiClient.get('/wanted', { params });

export const getWantedById = (id: string) => apiClient.get(`/wanted/${id}`);

export const addWanted = (data: WantedVehicleData) => apiClient.post('/wanted', data);

export const updateWanted = (id: string, data: WantedVehicleData) => apiClient.put(`/wanted/${id}`, data);

export const deleteWanted = (id: string) => apiClient.delete(`/wanted/${id}`);

export const getWantedStats = () => apiClient.get('/wanted/stats');

// Inspections
export const getInspections = (params: { page?: number; limit?: number }) => apiClient.get('/inspection', { params });

export const getInspectionById = (id: string) => apiClient.get(`/inspection/${id}`);

export const addInspection = (data: any) => apiClient.post('/inspection', data);

export const updateInspection = (id: string, data: any) => apiClient.put(`/inspection/${id}`, data);

export const deleteInspection = (id: string) => apiClient.delete(`/inspection/${id}`);

// Admin
export const getUsers = () => apiClient.get('/admin/users');

export const getUserById = (id: string) => apiClient.get(`/admin/users/${id}`);

export const addUser = (data: any) => apiClient.post('/admin/users', data);

export const updateUser = (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data);

export const deleteUser = (id: string) => apiClient.delete(`/admin/users/${id}`);

// User Profile
export const getUserProfile = () => apiClient.get('/profile');

export const updateUserProfile = (data: any) => apiClient.put('/profile', data);

// Auth
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = (data: LoginData) => apiClient.post('/auth/login', data);

export const register = (data: RegisterData) => apiClient.post('/auth/register', data);

export const logout = () => apiClient.post('/auth/logout');

// Search
export const searchVehicles = (query: string) => apiClient.get('/search/vehicles', { params: { q: query } });

export const searchAccidents = (query: string) => apiClient.get('/search/accidents', { params: { q: query } });

export const searchWanted = (query: string) => apiClient.get('/search/wanted', { params: { q: query } });

// Owners
export interface OwnerData {
  fullName: string;
  address: string;
  phone: string;
}

export const getOwners = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/owners', { params });

export const addOwner = (data: OwnerData) => apiClient.post('/owners', data);

export const getOwnerById = (id: string) => apiClient.get(`/owners/${id}`);

export const updateOwner = (id: string, data: OwnerData) => apiClient.put(`/owners/${id}`, data);

export const deleteOwner = (id: string) => apiClient.delete(`/owners/${id}`);

// Brands
export const getBrands = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/brands', { params });

// Alarm Systems
export const getAlarmSystems = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/alarm-systems', { params });

// Registration Numbers
export const getRegistrationNumbers = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/registration-numbers', { params });

// License Plates
export const getLicensePlates = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/license-plates', { params });

export const validateLicensePlate = (licenseNumber: string) =>
  apiClient.get<boolean>(`/license-plates/validate/${licenseNumber}`);

export const getHotLicensePlates = () =>
  apiClient.get<LicensePlate[]>('/license-plates/hot');

// Numbers
export interface NumberData {
  licensePlate: string;
  number: number;
  series: string;
  status: boolean;
}

export const getNumbers = (params: { status?: string; series?: string; page?: number; limit?: number }) =>
  apiClient.get('/numbers', { params });

export const addNumber = (data: NumberData) => apiClient.post('/numbers', data);

export const getNumberById = (number: string) => apiClient.get(`/numbers/${number}`);

export const updateNumber = (number: string, data: NumberData) => apiClient.put(`/numbers/${number}`, data);

export const deleteNumber = (number: string) => apiClient.delete(`/numbers/${number}`);

// Thefts
export interface TheftData {
  vehicleId: number;
  theftDate: string;
  location: { lat: number; lng: number };
  description: string;
}

export const getThefts = (params: { dateFrom?: string; dateTo?: string; page?: number; limit?: number }) =>
  apiClient.get('/thefts', { params });

export const addTheft = (data: TheftData) => apiClient.post('/thefts', data);

export const getTheftById = (id: string) => apiClient.get(`/thefts/${id}`);

export const updateTheft = (id: string, data: TheftData) => apiClient.put(`/thefts/${id}`, data);

export const deleteTheft = (id: string) => apiClient.delete(`/thefts/${id}`);

export interface SalePurchaseData {
  vehicleId: number;
  date: string;
  cost: number;
  buyerId: number;
  sellerId: number;
}

export const addSalePurchase = (data: SalePurchaseData) => apiClient.post('/sales-purchases', data);

export const getSalePurchases = () => apiClient.get('/sales-purchases');

export const getSalePurchaseById = (id: string) => apiClient.get(`/sales-purchases/${id}`);

export const updateSalePurchase = (id: string, data: SalePurchaseData) => apiClient.put(`/sales-purchases/${id}`, data);

export const deleteSalePurchase = (id: string) => apiClient.delete(`/sales-purchases/${id}`);
