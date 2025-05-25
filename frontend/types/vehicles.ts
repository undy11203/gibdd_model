import { Owner } from './owners';
import { Organization } from './organizations';
import { LicensePlate } from './license-plates';
import { AccidentInfoDTO } from './accidents'; // Import AccidentInfoDTO
import { Brand } from './brand';
import { AlarmSystem } from './alarm-systems';

export interface Vehicle {
  id: number;
  brand: Brand;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string; // Was VehicleType
  licensePlate: LicensePlate;
  owner: Owner;
  organization: Organization;
  alarmSystem: AlarmSystem; // This AlarmSystem is defined below
}

export interface VehicleData {
  brandId: number;
  alarmSystemId: number;
  ownerId: number;
  organizationId: number;
  licensePlateId: number;
  licensePlateNumber?: string; // Added for direct access to the license plate number
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
}

//Remove Brand
//Remove AlarmSystem

// Removed VehicleType enum
// Removed Reliability enum
// Removed TheftPopularity enum

export interface VehicleDossierDTO {
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  inAccident: boolean;
  passedInspection: boolean;
  accidents: AccidentInfoDTO[];
}
