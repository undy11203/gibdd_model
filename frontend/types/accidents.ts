import { Vehicle } from './vehicles';
import { Location, PageResponse } from './common';

export interface Accident {
  id: number;
  date: string;
  location: Location;
  type: string; // Was AccidentType
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
  role: string; // Was AccidentRole
}

export interface AccidentData {
  date: string;
  location: Location;
  type: string;
  description: string;
  victimsCount: number;
  damageAmount: number;
  cause: string;
  roadConditions: string;
  participants: AccidentParticipantData[];
}

export interface AccidentParticipantData {
  licensePlate: string;
  role: string;
}

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

export interface DangerousLocation extends Location {
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

// Removed AccidentType enum
// Removed AccidentRole enum

export interface AccidentInfoDTO {
  id: number;
  date: string; // Assuming LocalDate becomes string
  type: string; // Assuming AccidentType enum becomes string (key or description)
  description: string;
  victimsCount: number;
  damageAmount: number;
  cause: string;
  roadConditions: string;
  role: string; // Assuming AccidentRole enum becomes string (key or description)
}
