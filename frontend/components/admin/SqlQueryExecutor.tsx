'use client';

import { useState } from 'react';
import { executeRawQuery } from '@/utils/api/';
import { SqlQueryResponse } from '@/types/admin';

interface QueryResult {
  columns: string[];
  rows: any[];
  error?: string;
}

const SqlQueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!query.trim()) {
      setResult({ columns: [], rows: [], error: 'Введите SQL запрос' });
      return;
    }

    setLoading(true);
    try {
      const data = await executeRawQuery(query.trim());
      console.log('Response:', data);
      
      if (data.success) {
        if (data.results && data.results.length > 0) {
          // Extract column names from the first result
          const columns = Object.keys(data.results[0]);
          setResult({
            columns,
            rows: data.results
          });
        } else if (data.rowsAffected !== undefined) {
          // Handle DML queries (INSERT, UPDATE, DELETE)
          setResult({
            columns: ['Affected Rows'],
            rows: [{ 'Affected Rows': data.rowsAffected }]
          });
        } else {
          setResult({
            columns: [],
            rows: [],
            error: 'Запрос выполнен успешно, но не вернул данных'
          });
        }
      } else {
        setResult({
          columns: [],
          rows: [],
          error: data.error || 'Ошибка при выполнении запроса'
        });
      }
    } catch (err: any) {
      setResult({
        columns: [],
        rows: [],
        error: err.response?.data?.message || 'Ошибка при выполнении запроса'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
          SQL Запрос
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
          placeholder="SELECT * FROM your_table WHERE condition;"
        />
      </div>

      <div>
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Выполняется...' : 'Выполнить запрос'}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Результат запроса:</h3>
          
          {result.error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded">
              {result.error}
            </div>
          ) : result.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {result.columns.map((column, i) => (
                      <th key={i} className="px-4 py-2 border-b text-left">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} className="border-b">
                      {result.columns.map((column, j) => (
                        <td key={j} className="px-4 py-2">
                          {row[column]?.toString() || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 text-gray-700 rounded">
              Нет данных для отображения
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SqlQueryExecutor;
