'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import LicensePlateValidation from '../../components/pro_search/LicensePlateValidation';
import HotLicensePlates from '../../components/pro_search/HotLicensePlates';
import { PermissionGate } from '@/components/common/PermissionGate';

const tabs = [
  { id: 'validation', label: 'Проверка номера' },
  { id: 'hot', label: 'Горячие номера' }
];

export default function LicensePlatesPage() {
  const [activeTab, setActiveTab] = useState<'validation' | 'hot'>('validation');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Управление номерами</h1>
        </div>
      </div>

      <div className="mb-6">
        <TabNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
        />
      </div>

      {activeTab === 'validation' && (
        <PermissionGate 
          resource="vehicles" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для проверки номеров
          </div>}
        >
          <LicensePlateValidation />
        </PermissionGate>
      )}
      
      {activeTab === 'hot' && (
        <PermissionGate 
          resource="vehicles" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра горячих номеров
          </div>}
        >
          <HotLicensePlates />
        </PermissionGate>
      )}
    </div>
  );
}
