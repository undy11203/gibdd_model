export interface LicensePlate {
  licenseNumber: string;
  number: number;
  series: string;
  status: boolean;
  date: string;
}

export interface FreeLicensePlateRange {
  series: string;
  startNumber: number;
  endNumber: number;
}

export interface LicensePlateValidationResponse {
  isValid: boolean;
  message?: string;
}
