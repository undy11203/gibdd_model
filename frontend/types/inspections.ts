import { Vehicle } from './vehicles';
import { PageResponse } from './common';

export interface TechnicalInspection {
  id: number;
  vehicle: Vehicle;
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

export interface InspectionData {
  vehicleId: number;
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

export interface OverdueInspectionInfo {
  owner: {
    fullName: string;
    address: string;
  };
  vehicle: {
    licensePlate: {
      licenseNumber: string;
    };
    brand: {
      name: string;
    };
  };
  lastInspectionDate: string;
  daysOverdue: number;
}

export type InspectionResponse = PageResponse<TechnicalInspection>;
