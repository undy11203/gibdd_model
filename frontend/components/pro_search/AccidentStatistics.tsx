'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { AccidentStatisticsDTO } from "@/types"
import { getAccidentStatistics, getAccidentTypes } from '@/utils/api'; // Added getAccidentTypes
// Removed: import { AccidentType } from '@/types';

//5. Получить статистику по любому типу ДТП за указанный период.
const AccidentStatistics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState<string>(''); // Was AccidentType | ''
  const [statistics, setStatistics] = useState<AccidentStatisticsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accidentTypeOptions, setAccidentTypeOptions] = useState<string[]>([]); // To store fetched descriptions

  // Removed accidentTypeKeyToDescriptionMap as the backend /api/accidents/statistics will accept descriptions.

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getAccidentTypes();
        setAccidentTypeOptions(types);
      } catch (err) {
        console.error("Error fetching accident types for statistics filter", err);
      }
    };
    fetchTypes();
  }, []);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Пожалуйста, укажите период');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getAccidentStatistics({
        startDate,
        endDate,
        type: selectedType || undefined
      });
      setStatistics(response);
    } catch (err) {
      setError('Ошибка при получении статистики');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Статистика ДТП</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата начала
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата окончания
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип ДТП
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Все типы</option>
            {accidentTypeOptions.map((typeDescription) => (
              <option key={typeDescription} value={typeDescription}>
                {typeDescription}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Загрузка...' : 'Показать статистику'}
      </button>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {statistics.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Тип ДТП</th>
                <th className="px-4 py-2 border">Количество</th>
                <th className="px-4 py-2 border">Средний ущерб</th>
                <th className="px-4 py-2 border">Всего пострадавших</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat, index) => (
                <tr key={index}>
                  {/* Assuming stat.type from backend DTO will now be the description, or displaying key is acceptable if not */}
                  <td className="px-4 py-2 border">{stat.type}</td>
                  <td className="px-4 py-2 border text-center">{stat.count}</td>
                  <td className="px-4 py-2 border text-right">
                    {stat.averageDamage.toLocaleString('ru-RU', {
                      style: 'currency',
                      currency: 'RUB'
                    })}
                  </td>
                  <td className="px-4 py-2 border text-center">{stat.totalVictims}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccidentStatistics;
