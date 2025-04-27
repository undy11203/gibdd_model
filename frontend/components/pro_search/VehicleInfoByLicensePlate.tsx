"use client";

import React, { useState } from 'react';
import { getVehicleDossierByLicensePlate } from '@/utils/api';

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

//3. Получить "досье" на автомобиль по государственному номеру - номера двигателя, кузова и шасси, участвовал ли в ДТП, прошел ли техосмотр.
const VehicleInfoByLicensePlate = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [dossier, setDossier] = useState<VehicleDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setDossier(null);
    try {
      const response = await getVehicleDossierByLicensePlate(licensePlate);
      setDossier(response.data);
    } catch (err) {
      setError('Автомобиль не найден или произошла ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLicensePlate('');
    setDossier(null);
    setError(null);
  };

  return (
    <div className="max-w-md p-4 border rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Сведения о машине по номеру автомобиля</h2>
      <input
        type="text"
        placeholder="Введите номер автомобиля"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />
      <div className="flex space-x-2 mb-3">
        <button
          onClick={handleSearch}
          disabled={loading || licensePlate.trim() === ''}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors flex-1"
        >
          {loading ? 'Загрузка...' : 'Поиск'}
        </button>
        <button
          onClick={handleClear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors flex-1"
        >
          Очистить
        </button>
      </div>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {dossier && (
        <div>
          <p><strong>Номер двигателя:</strong> {dossier.engineNumber}</p>
          <p><strong>Номер шасси:</strong> {dossier.chassisNumber}</p>
          <p><strong>Номер кузова:</strong> {dossier.bodyNumber}</p>
          <p><strong>Участвовал в ДТП:</strong> {dossier.inAccident ? 'Да' : 'Нет'}</p>
          <p><strong>Последний техосмотр пройден:</strong> {dossier.passedInspection ? 'Да' : 'Нет'}</p>
          {dossier.accidents.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold">ДТП с участием автомобиля:</h3>
              <ul className="list-disc list-inside">
                {dossier.accidents.map((accident) => (
                  <li key={accident.id}>
                    <p><strong>Дата:</strong> {accident.date}</p>
                    <p><strong>Тип:</strong> {accident.type}</p>
                    <p><strong>Описание:</strong> {accident.description}</p>
                    <p><strong>Количество пострадавших:</strong> {accident.victimsCount}</p>
                    <p><strong>Сумма ущерба:</strong> {accident.damageAmount}</p>
                    <p><strong>Причина:</strong> {accident.cause}</p>
                    <p><strong>Дорожные условия:</strong> {accident.roadConditions}</p>
                    <p><strong>Роль:</strong> {accident.role}</p>
                    <hr className="my-2" />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleInfoByLicensePlate;
