'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import LicensePlateValidation from '../../components/pro_search/LicensePlateValidation';
import HotLicensePlates from '../../components/pro_search/HotLicensePlates';

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

      {activeTab === 'validation' && <LicensePlateValidation />}
      {activeTab === 'hot' && <HotLicensePlates />}
    </div>
  );
}
