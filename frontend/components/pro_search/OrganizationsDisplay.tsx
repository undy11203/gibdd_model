'use client';

import { useState, useEffect } from 'react';
import { getOrganizations, getOrganizationsByNumberFilter } from '../../utils/api';

interface Organization {
  id: number;
  name: string;
  district: string;
  address: string;
  director: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const OrganizationsDisplay = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [series, setSeries] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (series || (startDate && endDate)) {
        response = await getOrganizationsByNumberFilter({
          series: series || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        });
      } else {
        response = await getOrganizations({ page, limit: 10 });
      }

      const pageData = response.data as PageResponse<Organization>;
      setOrganizations(pageData.content);
      setTotalCount(pageData.totalElements);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      console.error(err);
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, series, startDate, endDate]);

  const handleFilter = () => {
    setPage(0);
    fetchOrganizations();
  };

  const clearFilters = () => {
    setSeries('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  if (loading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Фильтры поиска</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Серия номеров
            </label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Например: A"
            />
          </div>
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
          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Применить
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Общее количество */}
      <div className="bg-white rounded-lg shadow p-4">
        <span className="text-gray-600">Всего организаций:</span>{' '}
        <span className="font-medium">{totalCount}</span>
      </div>

      {/* Список организаций */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Район</th>
              <th className="px-4 py-2">Адрес</th>
              <th className="px-4 py-2">Директор</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b">
                <td className="px-4 py-2">{org.name}</td>
                <td className="px-4 py-2">{org.district}</td>
                <td className="px-4 py-2">{org.address}</td>
                <td className="px-4 py-2">{org.director}</td>
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

export default OrganizationsDisplay;
