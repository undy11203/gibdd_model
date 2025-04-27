"use client";

import React, { useState } from 'react';
import { getOwnerByLicenseNumber } from '@/utils/api';

interface OwnerInfo {
  id: number;
  fullName: string;
  address: string;
  phone: string;
}

//2. Получить сведения о владельце автотранспортного средства по государственному номеру автомашины.
const OwnerInfoByLicensePlate = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOwnerInfo = async () => {
    setError(null);
    setOwnerInfo(null);
    if (!licenseNumber.trim()) {
      setError('Введите номер автомобиля');
      return;
    }
    setLoading(true);
    try {
      const response = await getOwnerByLicenseNumber(licenseNumber.trim().toUpperCase());
      setOwnerInfo(response.data);
    } catch (err) {
      setError('Владелец не найден или ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-4 border rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Сведения о владельце по номеру автомобиля</h2>
      <input
        type="text"
        placeholder="Введите номер автомобиля"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />
      <button
        onClick={fetchOwnerInfo}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
      >
        {loading ? 'Загрузка...' : 'Получить сведения'}
      </button>
      {error && <p className="text-red-600 mt-3">{error}</p>}
      {ownerInfo && (
        <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200">
          <p><strong>ФИО:</strong> {ownerInfo.fullName}</p>
          <p><strong>Адрес:</strong> {ownerInfo.address}</p>
          <p><strong>Телефон:</strong> {ownerInfo.phone}</p>
        </div>
      )}
    </div>
  );
};

export default OwnerInfoByLicensePlate;
