import { Vehicle } from './vehicles';
import { PageResponse } from './common';

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
  reason: WantedReason;
  status: WantedStatus;
  description: string;
}

export interface WantedVehicleData {
  vehicleId: number;
  addedDate: string;
  reason: string;
  status: string;
}

export interface WantedVehicleStats {
  totalWantedVehicles: number;
  foundVehicles: number;
  foundPercentage: number;
  hitAndRunCount: number;
  stolenCount: number;
  averageSearchTime: number;
}

export enum WantedReason {
  HIT_AND_RUN = 'HIT_AND_RUN',
  THEFT = 'THEFT'
}

export enum WantedStatus {
  WANTED = 'WANTED',
  FOUND = 'FOUND'
}

export type WantedVehicleResponse = PageResponse<WantedVehicle>;
