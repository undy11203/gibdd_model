import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL вашего backend API
});

// Транспортные средства
export const getVehicles = (params: { type?: string; owner_id?: number; page?: number; limit?: number }) =>
  apiClient.get('/vehicles', { params });

export const addVehicle = (data: {
  brandId: number; // ID бренда
  alarmSystemId: number; // ID системы сигнализации
  ownerId: number; // ID владельца
  organizationId: number; // ID организации
  licensePlateId: number; // ID номерного знака
  releaseDate: string; // Дата выпуска
  engineVolume: number; // Объём двигателя
  engineNumber: string; // Номер двигателя
  chassisNumber: string; // Номер шасси
  bodyNumber: string; // Номер кузова
  color: string; // Цвет
  vehicleType: string; // Тип транспортного средства
}) => apiClient.post('/vehicles', data);

export const getVehicleById = (id: string) => apiClient.get(`/vehicles/${id}`);

export const updateVehicle = (id: string, data: {
  ID_Марка: number;
  Дата_выпуска: string;
  Объем_двигателя: number;
  Номер_двигателя: string;
  Номер_шасси: string;
  Номер_кузова: string;
  Цвет: string;
  Тип_ТС: string;
  Госномер: string;
  ID_владельца: number;
  ID_организации: number;
  ID_сигнализации: number;
}) => apiClient.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id: string) => apiClient.delete(`/vehicles/${id}`);

export const getSales = () => apiClient.get('/sales');
// Organizations
export const getOrganizations = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/organizations', { params });

export const addOrganization = (data: { name: string; district: string; address: string; director: string }) =>
  apiClient.post('/organizations', data);

export const getOrganizationById = (id: string) => apiClient.get(`/organizations/${id}`);

export const updateOrganization = (id: string, data: { name: string; district: string; address: string; director: string }) =>
  apiClient.put(`/organizations/${id}`, data);

export const deleteOrganization = (id: string) => apiClient.delete(`/organizations/${id}`);
// Accidents
export const getAccidents = (params: { date_from?: string; date_to?: string; type?: string; page?: number; limit?: number }) =>
  apiClient.get('/accidents', { params });

export const addAccident = (data: {
  date: string;
  location: { lat: number; lng: number };
  type: string;
  briefDescription: string;
  numberOfVictims: number;
  damageAmount: number;
  reason: string;
  roadConditions: string;
}) => apiClient.post('/accidents', data);

export const getAccidentById = (id: string) => apiClient.get(`/accidents/${id}`);

export const updateAccident = (id: string, data: {
  date: string;
  location: { lat: number; lng: number };
  type: string;
  briefDescription: string;
  numberOfVictims: number;
  damageAmount: number;
  reason: string;
  roadConditions: string;
}) => apiClient.put(`/accidents/${id}`, data);

export const deleteAccident = (id: string) => apiClient.delete(`/accidents/${id}`);

export const getAccidentsStats = () => apiClient.get('/accidents/stats');
// Розыск
export const getWantedVehicles = () => apiClient.get('/wanted');
export const getWantedVehicleById = (id: string) => apiClient.get(`/wanted/${id}`);
export const addWantedVehicle = (data: any) => apiClient.post('/wanted', data);
export const updateWantedVehicle = (id: string, data: any) => apiClient.put(`/wanted/${id}`, data);
export const deleteWantedVehicle = (id: string) => apiClient.delete(`/wanted/${id}`);
export const getWantedStats = () => apiClient.get('/wanted/stats');

// Техосмотр
export const getInspections = (params: { page?: number; limit?: number }) => apiClient.get('/inspection', { params });
export const getInspectionById = (id: string) => apiClient.get(`/inspection/${id}`);
export const addInspection = (data: any) => apiClient.post('/inspection', data);
export const updateInspection = (id: string, data: any) => apiClient.put(`/inspection/${id}`, data);
export const deleteInspection = (id: string) => apiClient.delete(`/inspection/${id}`);

// Администрирование
export const getUsers = () => apiClient.get('/admin/users');
export const getUserById = (id: string) => apiClient.get(`/admin/users/${id}`);
export const addUser = (data: any) => apiClient.post('/admin/users', data);
export const updateUser = (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data);
export const deleteUser = (id: string) => apiClient.delete(`/admin/users/${id}`);

// Профиль пользователя
export const getUserProfile = () => apiClient.get('/profile');
export const updateUserProfile = (data: any) => apiClient.put('/profile', data);

// Авторизация
export const login = (data: { email: string; password: string }) => 
  apiClient.post('/auth/login', data);
export const register = (data: { name: string; email: string; password: string }) => 
  apiClient.post('/auth/register', data);
export const logout = () => apiClient.post('/auth/logout');

// Поиск
export const searchVehicles = (query: string) => apiClient.get(`/search/vehicles?q=${query}`);
export const searchAccidents = (query: string) => apiClient.get(`/search/accidents?q=${query}`);
export const searchWanted = (query: string) => apiClient.get(`/search/wanted?q=${query}`);

// Owners
export const getOwners = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/owners', { params });

export const getBrands = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/brands', { params });

export const getAlarmSystems = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/alarm-systems', { params });

export const getRegistrationNumbers = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/registration-numbers', { params });

export const getLicensePlates = (params: { search?: string; page?: number; limit?: number }) =>
  apiClient.get('/license-plates', { params });

export const addOwner = (data: { fullName: string; address: string; phone: string }) =>
  apiClient.post('/owners', data);

export const getOwnerById = (id: string) => apiClient.get(`/owners/${id}`);

export const updateOwner = (id: string, data: { fullName: string; address: string; phone: string }) =>
  apiClient.put(`/owners/${id}`, data);

export const deleteOwner = (id: string) => apiClient.delete(`/owners/${id}`);

// Numbers
export const getNumbers = (params: { status?: string; series?: string; page?: number; limit?: number }) =>
  apiClient.get('/numbers', { params });

export const addNumber = (data: { licensePlate: string; number: number; series: string; status: boolean }) =>
  apiClient.post('/numbers', data);

export const getNumberById = (number: string) => apiClient.get(`/numbers/${number}`);

export const updateNumber = (number: string, data: { licensePlate: string; number: number; series: string; status: boolean }) =>
  apiClient.put(`/numbers/${number}`, data);

export const deleteNumber = (number: string) => apiClient.delete(`/numbers/${number}`);

// Thefts
export const getThefts = (params: { date_from?: string; date_to?: string; page?: number; limit?: number }) =>
  apiClient.get('/thefts', { params });

export const addTheft = (data: {
  vehicleId: number;
  theftDate: string;
  location: { lat: number; lng: number };
  description: string;
}) => apiClient.post('/thefts', data);

export const getTheftById = (id: string) => apiClient.get(`/thefts/${id}`);

export const updateTheft = (id: string, data: {
  vehicleId: number;
  theftDate: string;
  location: { lat: number; lng: number };
  description: string;
}) => apiClient.put(`/thefts/${id}`, data);

export const deleteTheft = (id: string) => apiClient.delete(`/thefts/${id}`);

// Wanted
export const getWanted = (params: { status?: string; page?: number; limit?: number }) =>
  apiClient.get('/wanted', { params });

export const addWanted = (data: {
  vehicleId: number;
  additionDate: string;
  reason: string;
  status: string;
}) => apiClient.post('/wanted', data);

export const getWantedById = (id: string) => apiClient.get(`/wanted/${id}`);

export const updateWanted = (id: string, data: {
  vehicleId: number;
  additionDate: string;
  reason: string;
  status: string;
}) => apiClient.put(`/wanted/${id}`, data);

export const deleteWanted = (id: string) => apiClient.delete(`/wanted/${id}`);
