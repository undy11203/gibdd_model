'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import OrganizationsDisplay from '../../components/pro_search/OrganizationsDisplay';
import OrganizationNumberFilter from '../../components/pro_search/OrganizationNumberFilter';

const tabs = [
  { id: 'list', label: 'Список организаций' },
];

export default function OrganizationsPage() {
  const [activeTab, setActiveTab] = useState<'list'>('list');

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
        <>
          <OrganizationsDisplay />
        </>
      )}
    </div>
  );
}
