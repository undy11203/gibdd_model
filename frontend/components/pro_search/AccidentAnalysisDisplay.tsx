'use client';

import { useState, useEffect } from 'react';
import { AccidentAnalysis, DrunkDrivingStats } from "@/types";
import { getAccidentAnalysis, getDrunkDrivingStats } from '@/utils/api';

//6. Получить результаты анализа ДТП: самые опасные места в городе, самая частая причина ДТП.
//7. Получить данные о количестве ДТП, совершаемых водителями в нетрезвом виде и доля таких происшествий в общем количестве ДТП.
const AccidentAnalysisDisplay = () => {
  const [analysis, setAnalysis] = useState<AccidentAnalysis | null>(null);
  const [drunkStats, setDrunkStats] = useState<DrunkDrivingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [analysisData, drunkStatsData] = await Promise.all([
          getAccidentAnalysis(),
          getDrunkDrivingStats()
        ]);
        setAnalysis(analysisData);
        setDrunkStats(drunkStatsData);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Опасные места */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Самые опасные места в городе</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Координаты</th>
                <th className="px-4 py-2">Количество ДТП</th>
                <th className="px-4 py-2">Средний ущерб</th>
                <th className="px-4 py-2">Всего пострадавших</th>
              </tr>
            </thead>
            <tbody>
              {analysis?.dangerousLocations.map((location, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-center">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </td>
                  <td className="px-4 py-2 text-center">{location.accidentCount}</td>
                  <td className="px-4 py-2 text-right">
                    {location.averageDamage.toLocaleString('ru-RU', {
                      style: 'currency',
                      currency: 'RUB'
                    })}
                  </td>
                  <td className="px-4 py-2 text-center">{location.totalVictims}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Самая частая причина */}
      {analysis?.mostFrequentCause && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Самая частая причина ДТП</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Причина</div>
              <div className="text-lg font-medium">{analysis.mostFrequentCause.cause}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Количество ДТП</div>
              <div className="text-lg font-medium">{analysis.mostFrequentCause.accidentCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Процент от общего числа</div>
              <div className="text-lg font-medium">
                {analysis.mostFrequentCause.percentageOfTotal.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Статистика по нетрезвым водителям */}
      {drunkStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Статистика ДТП с нетрезвыми водителями</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Всего ДТП</div>
              <div className="text-lg font-medium">{drunkStats.totalAccidents}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">ДТП с нетрезвыми водителями</div>
              <div className="text-lg font-medium">{drunkStats.drunkDrivingAccidents}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Процент от общего числа</div>
              <div className="text-lg font-medium">
                {drunkStats.drunkDrivingPercentage.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded md:col-span-2">
              <div className="text-sm text-gray-600">Средний ущерб</div>
              <div className="text-lg font-medium">
                {drunkStats.averageDamageAmount.toLocaleString('ru-RU', {
                  style: 'currency',
                  currency: 'RUB'
                })}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Всего пострадавших</div>
              <div className="text-lg font-medium">{drunkStats.totalVictims}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccidentAnalysisDisplay;
