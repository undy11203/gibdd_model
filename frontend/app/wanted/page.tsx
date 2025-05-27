'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import WantedVehiclesDisplay from '../../components/pro_search/WantedVehiclesDisplay';
import AddWantedVehicleForm from '../../components/forms/AddWantedVehicleForm';
import { PermissionGate } from '@/components/common/PermissionGate';

const tabs = [
  { id: 'list', label: 'Список розыска' },
  { id: 'add', label: 'Добавить в розыск' }
];

export default function WantedPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Розыск транспортных средств</h1>
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
          resource="wanted" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра списка розыска
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Здесь вы можете просмотреть информацию о транспортных средствах в розыске, 
              включая угнанные автомобили и скрывшихся с места ДТП, а также статистику 
              эффективности розыскной работы.
            </p>
          </div>
          <WantedVehiclesDisplay key={refreshTrigger} />
        </PermissionGate>
      )}

      {activeTab === 'add' && (
        <PermissionGate 
          resource="wanted" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для добавления транспортных средств в розыск
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Заполните форму для добавления транспортного средства в розыск. 
              Убедитесь, что указанный номерной знак зарегистрирован в системе.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <AddWantedVehicleForm />
          </div>
        </PermissionGate>
      )}
    </div>
  );
}
