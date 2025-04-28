'use client';

import { useState, useEffect } from 'react';
import { getHotLicensePlates } from '../../utils/api';

export default function HotLicensePlates() {
  const [hotPlates, setHotPlates] = useState<Array<{ licenseNumber: string; status: boolean }>>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchHotPlates() {
    try {
      const response = await getHotLicensePlates();
      if (response.status !== 200) {
        setError("Ошибка при загрузке горячих номеров");
        return;
      }
      setHotPlates(response.data);
    } catch (e) {
      setError("Ошибка сети при загрузке горячих номеров");
    }
  }

  useEffect(() => {
    fetchHotPlates();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Горячие номера</h2>
      
      {error ? (
        <div className="p-4 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
      ) : hotPlates.length === 0 ? (
        <p className="text-gray-500">Нет доступных номеров</p>
      ) : (
        <div className="grid gap-4">
          {hotPlates.map((plate) => (
            <div 
              key={plate.licenseNumber}
              className={`p-4 rounded-md ${
                plate.status ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{plate.licenseNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  plate.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {plate.status ? 'Свободен' : 'Занят'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
