'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import SqlQueryExecutor from '../../components/admin/SqlQueryExecutor';
import { RoleManagement } from '../../components/admin/RoleManagement';
import { PermissionGate } from '@/components/common/PermissionGate';

const tabs = [
  { id: 'sql', label: 'SQL запросы' },
  { id: 'roles', label: 'Управление ролями' }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'sql' | 'roles'>('sql');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Администрирование</h1>
        </div>
      </div>

      <div className="mb-6">
        <TabNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
        />
      </div>

      {activeTab === 'sql' && (
        <PermissionGate 
          resource="sql" 
          action="execute"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для выполнения SQL запросов
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Выполнение произвольных SQL запросов к базе данных. Будьте осторожны при использовании 
              операторов изменения данных (INSERT, UPDATE, DELETE).
            </p>
          </div>
          <SqlQueryExecutor />
        </PermissionGate>
      )}

      {activeTab === 'roles' && (
        <PermissionGate 
          resource="roles" 
          action="manage"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для управления ролями и разрешениями
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Управление ролями пользователей и назначение разрешений. Здесь вы можете создавать 
              новые роли, редактировать существующие и назначать им разрешения.
            </p>
          </div>
          <RoleManagement />
        </PermissionGate>
      )}
    </div>
  );
}
