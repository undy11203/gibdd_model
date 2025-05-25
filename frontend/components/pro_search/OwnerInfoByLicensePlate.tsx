"use client";

import React, { useState } from 'react';
import { getOwnerByLicenseNumber } from '@/utils/api';
import { getVehicleDossierByLicensePlate } from '@/utils/api/vehicles';

interface OwnerInfo {
  id: number;
  fullName: string;
  address: string;
  phone: string;
}

interface AccidentInfo {
  id: number;
  date: string;
  type: string;
  description: string;
  victimsCount: number;
  damageAmount: number;
  cause: string;
  roadConditions: string;
  role: string;
}

interface VehicleDossier {
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  inAccident: boolean;
  passedInspection: boolean;
  accidents: AccidentInfo[];
}

//2. Получить сведения о владельце автотранспортного средства по государственному номеру автомашины.
const OwnerInfoByLicensePlate = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [vehicleDossier, setVehicleDossier] = useState<VehicleDossier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    setError(null);
    setOwnerInfo(null);
    setVehicleDossier(null);
    
    if (!licenseNumber.trim()) {
      setError('Введите номер автомобиля');
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch owner information
      const ownerResponse = await getOwnerByLicenseNumber(licenseNumber.trim().toUpperCase());
      setOwnerInfo(ownerResponse);
      
      // Fetch vehicle dossier
      try {
        const dossierResponse = await getVehicleDossierByLicensePlate(licenseNumber.trim().toUpperCase());
        setVehicleDossier(dossierResponse);
      } catch (dossierErr) {
        console.error("Error fetching vehicle dossier:", dossierErr);
        // We don't set an error here because we still have owner info
      }
    } catch (err) {
      setError('Владелец не найден или ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLicenseNumber('');
    setOwnerInfo(null);
    setVehicleDossier(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl p-4 border rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Сведения о владельце и автомобиле по номеру</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Введите номер автомобиля"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={fetchInfo}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
        >
          {loading ? 'Загрузка...' : 'Получить сведения'}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Очистить
        </button>
      </div>
      
      {error && <p className="text-red-600 mt-3 mb-3">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Owner Information */}
        {ownerInfo && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Информация о владельце</h3>
            <p><strong>ФИО:</strong> {ownerInfo.fullName}</p>
            <p><strong>Адрес:</strong> {ownerInfo.address}</p>
            <p><strong>Телефон:</strong> {ownerInfo.phone}</p>
          </div>
        )}
        
        {/* Vehicle Dossier */}
        {vehicleDossier && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Информация об автомобиле</h3>
            <p><strong>Номер двигателя:</strong> {vehicleDossier.engineNumber}</p>
            <p><strong>Номер шасси:</strong> {vehicleDossier.chassisNumber}</p>
            <p><strong>Номер кузова:</strong> {vehicleDossier.bodyNumber}</p>
            <p><strong>Участвовал в ДТП:</strong> {vehicleDossier.inAccident ? 'Да' : 'Нет'}</p>
            <p><strong>Последний техосмотр пройден:</strong> {vehicleDossier.passedInspection ? 'Да' : 'Нет'}</p>
          </div>
        )}
      </div>
      
      {/* Accident Information */}
      {vehicleDossier && vehicleDossier.accidents && vehicleDossier.accidents.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">ДТП с участием автомобиля</h3>
          <div className="space-y-4">
            {vehicleDossier.accidents.map((accident) => (
              <div key={accident.id} className="p-3 border border-gray-300 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Дата:</strong> {accident.date}</p>
                  <p><strong>Тип:</strong> {accident.type}</p>
                  <p><strong>Количество пострадавших:</strong> {accident.victimsCount}</p>
                  <p><strong>Сумма ущерба:</strong> {accident.damageAmount}</p>
                  <p><strong>Причина:</strong> {accident.cause}</p>
                  <p><strong>Дорожные условия:</strong> {accident.roadConditions}</p>
                  <p><strong>Роль:</strong> {accident.role}</p>
                </div>
                <p className="mt-2"><strong>Описание:</strong> {accident.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerInfoByLicensePlate;
