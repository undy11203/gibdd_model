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
  fullName: string;
  totalCount: number;
}

export type InspectionResponse = PageResponse<TechnicalInspection>;
