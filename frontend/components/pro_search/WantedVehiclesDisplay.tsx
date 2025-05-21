'use client';

import { useState, useEffect } from 'react';
import { getWantedVehicles, getWantedVehicleStats } from '../../utils/api/wanted';
import { WantedVehicle, WantedVehicleStats, WantedReason, WantedStatus } from '../../types/wanted';
import { PageResponse } from '../../types/common';

//8. Получить список машин, отданных в розыск, будь то скрывшиеся с места ДТП или угнанные.
//9. Получить данные об эффективности розыскной работы: количество найденных машин в процентном отношении.
//10. Получить перечень и общее число угонов за указанный период.
//11. Получить статистику по угонам: самые угоняемые марки машин, самые надежные сигнализации и т.п.
const WantedVehiclesDisplay = () => {
  const [vehicles, setVehicles] = useState<WantedVehicle[]>([]);
  const [stats, setStats] = useState<WantedVehicleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedReason, setSelectedReason] = useState<WantedReason | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare date parameters if both dates are provided
        const dateParams = (startDate && endDate) ? { startDate, endDate } : {};
        
        const [vehiclesResponse, statsResponse] = await Promise.all([
          getWantedVehicles({ 
            reason: selectedReason, 
            page, 
            size: 10,
            ...dateParams
          }),
          getWantedVehicleStats()
        ]);

        setVehicles(vehiclesResponse.content);
        setTotalPages(vehiclesResponse.totalPages);
        setStats(statsResponse);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedReason, startDate, endDate]);

  if (loading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Фильтры поиска</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Причина розыска
            </label>
            <select
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value as WantedReason | '');
                setPage(0);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Все причины</option>
              <option value={WantedReason.THEFT}>Угон</option>
              <option value={WantedReason.HIT_AND_RUN}>Скрылся с места ДТП</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата начала
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0); // Reset to first page when changing filters
              }}
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
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0); // Reset to first page when changing filters
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setPage(0);
              }}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Сбросить даты
            </button>
          </div>
        </div>
      </div>

      {/* Статистика розыска */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Статистика розыскной работы</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Всего в розыске</div>
              <div className="text-lg font-medium">{stats.totalWantedVehicles}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Найдено</div>
              <div className="text-lg font-medium">{stats.foundVehicles}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Процент найденных</div>
              <div className="text-lg font-medium">{stats.foundPercentage.toFixed(2)}%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Угонов</div>
              <div className="text-lg font-medium">{stats.stolenCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Скрывшихся с места ДТП</div>
              <div className="text-lg font-medium">{stats.hitAndRunCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Среднее время поиска</div>
              <div className="text-lg font-medium">{stats.averageSearchTime.toFixed(1)} дней</div>
            </div>
          </div>
        </div>
      )}

      {/* Список машин в розыске */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2">Номер</th>
              <th className="px-4 py-2">Марка</th>
              <th className="px-4 py-2">Цвет</th>
              <th className="px-4 py-2">Причина</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b">
                <td className="px-4 py-2 text-center">{vehicle.vehicle.licensePlate?.licenseNumber || 'Нет номера'}</td>
                <td className="px-4 py-2">{vehicle.vehicle.brand?.name || 'Неизвестно'}</td>
                <td className="px-4 py-2">{vehicle.vehicle.color || 'Неизвестно'}</td>
                <td className="px-4 py-2">
                  {vehicle.reason === WantedReason.HIT_AND_RUN ? 'Скрылся с места ДТП' : 'Угон'}
                </td>
                <td className="px-4 py-2">
                  {new Date(vehicle.addedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {vehicle.status === WantedStatus.WANTED ? 'В розыске' : 'Найден'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Назад
          </button>
          <span className="px-4 py-2">
            Страница {page + 1} из {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default WantedVehiclesDisplay;
