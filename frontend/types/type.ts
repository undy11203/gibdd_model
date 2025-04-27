export interface Accident {
  id: number;
  date: string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: string;
  description: string;
  victimsCount: number;
  damageAmount: number;
  cause: string;
  roadConditions: string;
}

export interface AccidentParticipant {
  id: number;
  accident: Accident;
  vehicle: Vehicle;
  role: string;
}

export interface Vehicle {
  id: number;
  brand: Brand;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
  licensePlate: LicensePlate;
  owner: Owner;
  organization: Organization;
  alarmSystem: AlarmSystem;
}

export interface Brand {
  id: number;
  name: string;
  theftPopularity: string;
}

export enum AccidentType {
  COLLISION = 'COLLISION', // Столкновение
  OVERTURNING = 'OVERTURNING', // Опрокидывание
  HIT_AND_RUN = 'HIT_AND_RUN', // Наезд и скрытие
  PEDESTRIAN_HIT = 'PEDESTRIAN_HIT', // Наезд на пешехода
  OTHER = 'OTHER' // Прочие
}

export interface LicensePlate {
  licenseNumber: string;
  number: number;
  series: string;
  status: boolean;
  date: string;
}

export interface Owner {
  id: number;
  fullName: string;
  address: string;
  phone: string;
}

export interface Organization {
  id: number;
  name: string;
  district: string;
  address: string;
  director: string;
}

export interface AlarmSystem {
  id: number;
  name: string;
  reliability: string;
}

export interface FreeLicensePlateRange {
  series: string;
  startNumber: number;
  endNumber: number;
}

export interface SalePurchase {
  id: number;
  vehicle: Vehicle;
  date: string;
  cost: number;
  buyer: Owner;
  seller: Owner;
}

export interface TechnicalInspection {
  id: number;
  vehicle: Vehicle;
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

export interface Theft {
  id: number;
  vehicle: Vehicle;
  theftDate: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

export interface WantedVehicle {
  id: number;
  vehicle: Vehicle;
  addedDate: string;
  reason: string;
  status: string;
}

export enum AccidentRole {
  CULPRIT = 'CULPRIT',
  VICTIM = 'VICTIM',
  WITNESS = 'WITNESS'
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

export enum VehicleType {
  PASSENGER = 'PASSENGER',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  BUS = 'BUS',
  TRAILER = 'TRAILER'
}

export enum WantedStatus {
  WANTED = 'WANTED',
  FOUND = 'FOUND'
}
