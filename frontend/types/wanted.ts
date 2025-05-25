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
  reason: string; // Was WantedReason
  status: string; // Was WantedStatus
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

// Removed WantedReason enum
// Removed WantedStatus enum

export type WantedVehicleResponse = PageResponse<WantedVehicle>;
