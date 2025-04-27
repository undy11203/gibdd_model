import axios from 'axios';
import { LicensePlate } from '../types/type';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export interface AccidentParticipantData {
  licensePlate: string;
  role: string;
}

export interface AccidentData {
  date: string;
  location: { lat: number; lng: number };
  type: string;
  description: string;
  victimsCount: number;
  damageAmount: number;
  cause: string;
  roadConditions: string;
  participants: AccidentParticipantData[];
}

export const addAccident = (data: AccidentData) => apiClient.post<any>('/accidents', data);
export const getVehicleByLicensePlate = (licensePlate: string) => 
  apiClient.get<any>(`/vehicles/by-license-plate/${licensePlate}`);

export interface OwnerData {
  fullName: string;
  address: string;
  phone: string;
}

export const getOwners = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/owners', { params });
export const addOwner = (data: OwnerData) => apiClient.post('/owners', data);

export interface Organization {
  id: number;
  name: string;
  district: string;
  address: string;
  director: string;
}

export interface OrganizationData {
  name: string;
  district: string;
  address: string;
  director: string;
}

export interface OrganizationNumberFilterParams {
  series?: string;
  startDate?: string;
  endDate?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const getOrganizations = (params: { 
  search?: string; 
  page?: number; 
  limit?: number;
}) => apiClient.get<PageResponse<Organization>>('/organizations', { params });

export const addOrganization = (data: OrganizationData) => 
  apiClient.post<Organization>('/organizations', data);

export const getOrganizationsByNumberFilter = (params: OrganizationNumberFilterParams) =>
  apiClient.get<PageResponse<Organization>>('/organizations/number-filter', { params });

export const getOrganizationById = (id: number) =>
  apiClient.get<Organization>(`/organizations/${id}`);

export const getOwnerByLicenseNumber = (params: String) => apiClient.get(`/owner-by-license`, { params });

export interface SalePurchaseData {
  vehicleId: number;
  date: string;
  cost: number;
  buyerId: number;
  sellerId: number;
}

export const addSalePurchase = (data: SalePurchaseData) => apiClient.post('/sales-purchases', data);

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

export const getSalePurchases = () => apiClient.get('/sales-purchases');

export interface AccidentStatisticsDTO {
  type: string;
  count: number;
  averageDamage: number;
  totalVictims: number;
}

export interface AccidentStatisticsParams {
  startDate: string;
  endDate: string;
  type?: string;
}

export const getAccidentStatistics = (params: AccidentStatisticsParams) =>
  apiClient.get<AccidentStatisticsDTO[]>('/accidents/statistics', { params });

export interface DangerousLocation {
  latitude: number;
  longitude: number;
  accidentCount: number;
  averageDamage: number;
  totalVictims: number;
}

export interface CauseAnalysis {
  cause: string;
  accidentCount: number;
  percentageOfTotal: number;
}

export interface AccidentAnalysis {
  dangerousLocations: DangerousLocation[];
  mostFrequentCause: CauseAnalysis;
}

export interface DrunkDrivingStats {
  totalAccidents: number;
  drunkDrivingAccidents: number;
  drunkDrivingPercentage: number;
  averageDamageAmount: number;
  totalVictims: number;
}

export const getAccidentAnalysis = () => 
  apiClient.get<AccidentAnalysis>('/accidents/analysis');

export interface WantedVehicleStats {
  totalWantedVehicles: number;
  foundVehicles: number;
  foundPercentage: number;
  hitAndRunCount: number;
  stolenCount: number;
  averageSearchTime: number;
}

export interface WantedVehicle {
  id: number;
  vehicle: {
    licensePlate: {
      licenseNumber: string;
    };
    brand: {
      name: string;
    };
    color: string;
  };
  addedDate: string;
  foundDate?: string;
  reason: 'HIT_AND_RUN' | 'THEFT';
  status: 'WANTED' | 'FOUND';
  description: string;
}

export const getWantedVehicles = (params: { 
  reason?: string; 
  page?: number; 
  size?: number; 
}) => apiClient.get<PageResponse<WantedVehicle>>('/wanted', { params });

export const getHitAndRunVehicles = () => 
  apiClient.get<WantedVehicle[]>('/wanted/hit-and-run');

export const getStolenVehicles = () => 
  apiClient.get<WantedVehicle[]>('/wanted/stolen');

export const getWantedVehicleStats = () => 
  apiClient.get<WantedVehicleStats>('/wanted/stats');

export const getFoundVehicles = (params: { 
  startDate: string; 
  endDate: string; 
}) => apiClient.get<WantedVehicle[]>('/wanted/found', { params });

export const addToWanted = (data: Omit<WantedVehicle, 'id'>) => 
  apiClient.post<WantedVehicle>('/wanted', data);

export const markAsFound = (id: number, foundDate: string) => 
  apiClient.put<WantedVehicle>(`/wanted/${id}/found`, null, { 
    params: { foundDate } 
  });

export const getDrunkDrivingStats = () => 
  apiClient.get<DrunkDrivingStats>('/accidents/drunk-driving-stats');

export interface TheftStatistics {
  totalThefts: number;
  mostStolenBrands: {
    brandName: string;
    theftCount: number;
    percentage: number;
  }[];
  alarmSystemEfficiency: {
    alarmSystemName: string;
    installedCount: number;
    theftCount: number;
    reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  theftsByDistrict: {
    district: string;
    theftCount: number;
    percentage: number;
  }[];
  recoveryRate: number;
  averageSearchTime: number;
}

export interface TheftListParams {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
}

export interface TheftInfo {
  id: number;
  date: string;
  vehicle: {
    licensePlate: {
      licenseNumber: string;
    };
    brand: {
      name: string;
    };
    color: string;
    alarmSystem?: {
      name: string;
    };
  };
  district: string;
  recovered: boolean;
  recoveryDate?: string;
}

export const getTheftList = (params: TheftListParams) =>
  apiClient.get<PageResponse<TheftInfo>>('/thefts', { params });

export const getTheftStatistics = (params: { startDate: string; endDate: string }) =>
  apiClient.get<TheftStatistics>('/thefts/statistics', { params });

export const getVehicleDossierByLicensePlate = (licenseNumber: string) =>
  apiClient.get(`/vehicles/dossier-by-license`, { params: { licenseNumber } });

// Add SQL query execution endpoint
export interface QueryResult {
  [key: string]: any;
}

export const executeRawQuery = (query: string) => 
  apiClient.post<QueryResult[]>('/admin/execute-query', { query });
