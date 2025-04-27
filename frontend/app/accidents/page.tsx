'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import AccidentStatistics from '../../components/pro_search/AccidentStatistics';
import AccidentAnalysisDisplay from '../../components/pro_search/AccidentAnalysisDisplay';
import AddAccidentForm from '../../components/forms/AddAccidentForm';

const tabs = [
  { id: 'statistics', label: 'Статистика по типам' },
  { id: 'analysis', label: 'Анализ ДТП' },
  { id: 'register', label: 'Регистрация ДТП' }
];

export default function AccidentsPage() {
  const [activeTab, setActiveTab] = useState<'statistics' | 'analysis' | 'register'>('statistics');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Управление ДТП</h1>
        </div>
      </div>

      <div className="mb-6">
        <TabNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
        />
      </div>

      {activeTab === 'statistics' && <AccidentStatistics />}
      {activeTab === 'analysis' && <AccidentAnalysisDisplay />}
      {activeTab === 'register' && <AddAccidentForm />}
    </div>
  );
}
