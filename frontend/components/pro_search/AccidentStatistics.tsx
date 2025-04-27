'use client';

import { useState } from 'react';
import { AccidentStatisticsDTO, getAccidentStatistics } from '../../utils/api';
import { AccidentType } from '../../types/type';

//5. Получить статистику по любому типу ДТП за указанный период.
const AccidentStatistics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState<AccidentType | ''>('');
  const [statistics, setStatistics] = useState<AccidentStatisticsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accidentTypeLabels: Record<AccidentType, string> = {
    [AccidentType.COLLISION]: 'Столкновение',
    [AccidentType.OVERTURNING]: 'Опрокидывание',
    [AccidentType.HIT_AND_RUN]: 'Наезд и скрытие',
    [AccidentType.PEDESTRIAN_HIT]: 'Наезд на пешехода',
    [AccidentType.OTHER]: 'Прочие'
  };

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
      setStatistics(response.data);
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
            onChange={(e) => setSelectedType(e.target.value as AccidentType | '')}
            className="w-full p-2 border rounded"
          >
            <option value="">Все типы</option>
            {Object.entries(accidentTypeLabels).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
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
                  <td className="px-4 py-2 border">{accidentTypeLabels[stat.type as AccidentType] || stat.type}</td>
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
