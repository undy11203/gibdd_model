'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import OrganizationsDisplay from '../../components/pro_search/OrganizationsDisplay';
import AddOrganizationForm from '../../components/forms/AddOrganizationForm';
import { PermissionGate } from '@/components/common/PermissionGate';

const tabs = [
  { id: 'list', label: 'Список организаций' },
  { id: 'create', label: 'Создать организацию' },
];

export default function OrganizationsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Организации</h1>
        </div>
      </div>

      <div className="mb-6">
        <TabNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
        />
      </div>

      {activeTab === 'list' && (
        <PermissionGate 
          resource="vehicles" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра списка организаций
          </div>}
        >
          <OrganizationsDisplay />
        </PermissionGate>
      )}

      {activeTab === 'create' && (
        <PermissionGate 
          resource="vehicles" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для создания организаций
          </div>}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Создание новой организации</h2>
            <AddOrganizationForm />
          </div>
        </PermissionGate>
      )}
    </div>
  );
}
