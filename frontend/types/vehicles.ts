import { Owner } from './owners';
import { Organization } from './organizations';
import { LicensePlate } from './license-plates';

export interface Vehicle {
  id: number;
  brand: Brand;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: VehicleType;
  licensePlate: LicensePlate;
  owner: Owner;
  organization: Organization;
  alarmSystem: AlarmSystem;
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

export interface Brand {
  id: number;
  name: string;
  theftPopularity: TheftPopularity;
}

export interface AlarmSystem {
  id: number;
  name: string;
  reliability: Reliability;
}

export enum VehicleType {
  PASSENGER = 'PASSENGER',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  BUS = 'BUS',
  TRAILER = 'TRAILER'
}

export enum Reliability {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TheftPopularity {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}
