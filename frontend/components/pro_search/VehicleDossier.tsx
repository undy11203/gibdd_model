'use client';

import { useState } from 'react';
import { getVehicleDossierByLicensePlate } from '@/utils/api/vehicles';
import { VehicleDossierDTO, AccidentInfoDTO } from '@/types';

const VehicleDossier = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dossier, setDossier] = useState<VehicleDossierDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to map accident type/role keys to Russian descriptions
  // This is needed if AccidentInfoDTO.type and .role are keys from backend
  // For now, assuming they are keys and we want to display user-friendly text.
  // If they are already descriptions, this map lookup can be removed.
  const accidentTypeDisplay: { [key: string]: string } = {
    COLLISION: 'Столкновение',
    OVERTURNING: 'Опрокидывание',
    HIT_AND_RUN: 'Наезд и скрытие',
    PEDESTRIAN_HIT: 'Наезд на пешехода',
    OTHER: 'Прочие',
  };

  const accidentRoleDisplay: { [key: string]: string } = {
    CULPRIT: 'Виновник',
    VICTIM: 'Потерпевший',
    WITNESS: 'Свидетель',
  };


  const handleSearch = async () => {
    if (!licenseNumber.trim()) {
      setError('Пожалуйста, введите гос. номер.');
      setDossier(null);
      return;
    }
    setLoading(true);
    setError(null);
    setDossier(null);
    try {
      const data = await getVehicleDossierByLicensePlate(licenseNumber.trim());
      setDossier(data);
    } catch (err) {
      console.error('Error fetching vehicle dossier:', err);
      setError('Не удалось получить досье на автомобиль. Проверьте номер или попробуйте позже.');
      setDossier(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Досье на автомобиль</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
          placeholder="Введите гос. номер (например, А123ВС77)"
          className="border p-2 rounded-md w-full md:w-1/3"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {dossier && (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Информация по номеру: {licenseNumber}</h3>
          
          <div>
            <h4 className="font-medium text-gray-700">Идентификаторы:</h4>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>Номер двигателя: {dossier.engineNumber || 'N/A'}</li>
              <li>Номер шасси: {dossier.chassisNumber || 'N/A'}</li>
              <li>Номер кузова: {dossier.bodyNumber || 'N/A'}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Технический осмотр:</h4>
            <p className={`text-lg ${dossier.passedInspection ? 'text-green-600' : 'text-red-600'}`}>
              {dossier.passedInspection ? 'Пройден' : 'Не пройден / Нет данных'}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Участие в ДТП:</h4>
            <p className={`text-lg ${dossier.inAccident ? 'text-red-600' : 'text-green-600'}`}>
              {dossier.inAccident ? 'Участвовал' : 'Не участвовал / Нет данных'}
            </p>
          </div>

          {dossier.inAccident && dossier.accidents && dossier.accidents.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mt-4">Детали ДТП:</h4>
              <div className="space-y-3 mt-2">
                {dossier.accidents.map((accident: AccidentInfoDTO) => (
                  <div key={accident.id} className="p-3 bg-gray-50 rounded-md border">
                    <p><strong>Дата:</strong> {new Date(accident.date).toLocaleDateString()}</p>
                    <p><strong>Тип:</strong> {accidentTypeDisplay[accident.type] || accident.type}</p>
                    <p><strong>Роль в ДТП:</strong> {accidentRoleDisplay[accident.role] || accident.role}</p>
                    <p><strong>Описание:</strong> {accident.description}</p>
                    {accident.victimsCount > 0 && <p><strong>Пострадавшие:</strong> {accident.victimsCount}</p>}
                    <p><strong>Ущерб:</strong> {accident.damageAmount?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleDossier;
