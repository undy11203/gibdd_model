import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // URL вашего backend API
});

export const getVehicles = () => apiClient.get('/vehicles');
export const addVehicle = (data) => apiClient.post('/vehicles', data);

export const getOrganizations = () => apiClient.get('/organizations');

export const addAccident = (data) => apiClient.post('/accidents', data);