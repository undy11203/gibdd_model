"use client";

import React, { useState } from 'react';
import { Organization, PageResponse } from "@/types"
import { getOrganizationsByNumberFilter } from '@/utils/api';

//1. Получить перечень и общее число организаций, которым выделены номера либо с указанной серией, либо за указанный период.
const OrganizationNumberFilter = () => {
  const [series, setSeries] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFilter = async () => {
    setError(null);
    try {
      const params: any = {};
      if (series.trim() !== '') params.series = series.trim();
      if (startDate !== '') params.startDate = startDate;
      if (endDate !== '') params.endDate = endDate;

      const response = await getOrganizationsByNumberFilter(params);
      const pageData = response as PageResponse<Organization>;
      setFilteredOrgs(pageData.content);
      setTotalCount(pageData.totalElements);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error(err);
    }
  };

  return (
    <div className="mb-4 space-y-2 max-w-md">
      <h2 className="text-xl font-semibold mb-2">Фильтр организаций по выделенным номерам</h2>
      <div>
        <label htmlFor="series" className="block font-medium mb-1">Серия номера:</label>
        <input
          id="series"
          type="text"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Введите серию номера"
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block font-medium mb-1">Дата начала периода:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block font-medium mb-1">Дата окончания периода:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleFilter}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 transition-colors"
      >
        Применить фильтр
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {filteredOrgs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Результаты фильтрации</h3>
          <p className="mb-2">Общее число организаций: {totalCount}</p>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Название организации</th>
                <th className="border px-4 py-2">Адрес</th>
                <th className="border px-4 py-2">Район</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="border-t">
                  <td className="border px-4 py-2">{org.name}</td>
                  <td className="border px-4 py-2">{org.address}</td>
                  <td className="border px-4 py-2">{org.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrganizationNumberFilter;
