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
  page?: number;
  limit?: number;
}

export type OrganizationResponse = PageResponse<Organization>;
