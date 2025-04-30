import { PageResponse } from './common';

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

export type OrganizationResponse = PageResponse<Organization>;
