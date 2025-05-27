'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import AccidentStatistics from '../../components/pro_search/AccidentStatistics';
import AccidentAnalysisDisplay from '../../components/pro_search/AccidentAnalysisDisplay';
import AddAccidentForm from '../../components/forms/AddAccidentForm';
import { PermissionGate } from '@/components/common/PermissionGate';

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

      {activeTab === 'statistics' && (
        <PermissionGate 
          resource="statistics" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра статистики ДТП
          </div>}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <AccidentStatistics />
          </div>
        </PermissionGate>
      )}
      
      {activeTab === 'analysis' && (
        <PermissionGate 
          resource="accidents" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра анализа ДТП
          </div>}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <AccidentAnalysisDisplay />
          </div>
        </PermissionGate>
      )}
      
      {activeTab === 'register' && (
        <PermissionGate 
          resource="accidents" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для регистрации ДТП
          </div>}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <AddAccidentForm />
          </div>
        </PermissionGate>
      )}
    </div>
  );
}
