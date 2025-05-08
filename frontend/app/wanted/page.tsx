'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import WantedVehiclesDisplay from '../../components/pro_search/WantedVehiclesDisplay';
import AddWantedVehicleForm from '../../components/forms/AddWantedVehicleForm';

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
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Здесь вы можете просмотреть информацию о транспортных средствах в розыске, 
              включая угнанные автомобили и скрывшихся с места ДТП, а также статистику 
              эффективности розыскной работы.
            </p>
          </div>
          <WantedVehiclesDisplay key={refreshTrigger} />
        </>
      )}

      {activeTab === 'add' && (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Заполните форму для добавления транспортного средства в розыск. 
              Убедитесь, что указанный номерной знак зарегистрирован в системе.
            </p>
          </div>
          <AddWantedVehicleForm />
        </>
      )}
    </div>
  );
}
