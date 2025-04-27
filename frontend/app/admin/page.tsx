'use client';

import BackButton from '../../components/common/BackButton';
import SqlQueryExecutor from '../../components/admin/SqlQueryExecutor';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Здесь вы можете выполнять прямые SQL-запросы к базе данных. 
          Пожалуйста, будьте осторожны при выполнении запросов, изменяющих данные.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Внимание: Выполняйте запросы с осторожностью. Неправильные запросы могут повредить данные.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SqlQueryExecutor />
    </div>
  );
}
