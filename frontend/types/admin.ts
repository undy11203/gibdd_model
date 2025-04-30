export interface SqlQueryRequest {
  query: string;
}

export interface SqlQueryResponse {
  success: boolean;
  message?: string;
  rowsAffected?: number;
  results?: Array<{ [key: string]: any }>;
  error?: string;
}

export interface TheftStatistics {
  totalThefts: number;
  mostStolenBrands: {
    brandName: string;
    theftCount: number;
    percentage: number;
  }[];
  alarmSystemEfficiency: {
    alarmSystemName: string;
    installedCount: number;
    theftCount: number;
    reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  theftsByDistrict: {
    district: string;
    theftCount: number;
    percentage: number;
  }[];
  recoveryRate: number;
  averageSearchTime: number;
}

export interface TheftListParams {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
}

export interface TheftInfo {
  id: number;
  date: string;
  vehicle: {
    licensePlate: {
      licenseNumber: string;
    };
    brand: {
      name: string;
    };
    color: string;
    alarmSystem?: {
      name: string;
    };
  };
  district: string;
  recovered: boolean;
  recoveryDate?: string;
}
