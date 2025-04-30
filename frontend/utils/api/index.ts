// Export all API functions from their respective modules
export * from './auth';
export * from './roles';
export * from './accidents';
export * from './vehicles';
export * from './owners';
export * from './organizations';
export * from './wanted';
export * from './inspections';
export * from './admin';
export * from './license-plates';

// Export the API client for direct use if needed
export { default as apiClient } from './client';
