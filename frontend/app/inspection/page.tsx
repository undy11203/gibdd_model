'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import AddTechnicalInspectionForm from '../../components/forms/AddTechnicalInspectionForm';
import OwnersWithOverdueInspection from '../../components/pro_search/OwnersWithOverdueInspection';
import OwnerInspectionsDisplay from '../../components/pro_search/OwnerInspectionsDisplay';
import { PermissionGate } from '@/components/common/PermissionGate';

const tabs = [
  { id: 'list', label: 'Просроченные ТО' },
  { id: 'owner', label: 'ТО по владельцу' },
  { id: 'add', label: 'Добавить ТО' }
];

export default function InspectionPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'owner' | 'add'>('list');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Технический осмотр</h1>
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
          resource="inspections" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра информации о технических осмотрах
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Список владельцев с просроченным техническим осмотром. Система автоматически 
              определяет просроченные ТО на основе даты последнего осмотра и установленной 
              периодичности для данного типа ТС.
            </p>
          </div>
          <OwnersWithOverdueInspection />
        </PermissionGate>
      )}

      {activeTab === 'owner' && (
        <PermissionGate 
          resource="inspections" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра информации о технических осмотрах
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Просмотр, редактирование и удаление технических осмотров по выбранному владельцу.
              Выберите владельца для отображения всех его технических осмотров.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <OwnerInspectionsDisplay />
          </div>
        </PermissionGate>
      )}

      {activeTab === 'add' && (
        <PermissionGate 
          resource="inspections" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для регистрации технических осмотров
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Регистрация нового технического осмотра транспортного средства. 
              Укажите номерной знак ТС, дату проведения и результат осмотра.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <AddTechnicalInspectionForm />
          </div>
        </PermissionGate>
      )}
    </div>
  );
}
