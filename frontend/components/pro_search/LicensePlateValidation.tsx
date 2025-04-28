'use client';

import { useState } from 'react';
import { validateLicensePlate, getHotLicensePlates } from '../../utils/api';

export default function LicensePlateValidation() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hotPlates, setHotPlates] = useState<Array<{ licenseNumber: string; status: boolean }>>([]);

  async function validateLicensePlateHandler() {
    setError(null);
    setValidationResult(null);
    if (!licenseNumber) {
      setError("Введите номер для проверки");
      return;
    }
    try {
      const response = await validateLicensePlate(licenseNumber);
      if (response.status !== 200) {
        setError("Ошибка при проверке номера");
        return;
      }
      const isValid = response.data;
      setValidationResult(isValid ? "Номер корректен" : "Номер некорректен");
    } catch (e) {
      setError("Ошибка сети при проверке номера");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="license-number" className="block text-sm font-medium text-gray-700 mb-2">
            Номер автомобиля
          </label>
          <input
            id="license-number"
            type="text"
            placeholder="Введите номер"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={validateLicensePlateHandler}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Проверить
        </button>

        {validationResult && (
          <div className={`mt-4 p-4 rounded-md ${validationResult.includes("корректен") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {validationResult}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
