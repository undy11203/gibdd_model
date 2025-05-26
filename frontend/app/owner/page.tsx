'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import OwnerForm from '../../components/forms/OwnerForm';
import OwnerInfoByLicensePlate from '../../components/pro_search/OwnerInfoByLicensePlate';
import OwnersList from '../../components/pro_search/OwnersList';
import { PermissionGate } from '../../components/common/PermissionGate';

const tabs = [
  { id: 'search', label: 'Поиск информации' },
  { id: 'register', label: 'Регистрация владельца' },
  { id: 'list', label: 'Список владельцев' }
];

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'register' | 'list'>('search');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Управление владельцами</h1>
        </div>
      </div>

      <div className="mb-6">
        <TabNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
        />
      </div>

      {activeTab === 'search' && (
        <PermissionGate 
          resource="owners" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра информации о владельцах
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Поиск информации о владельце и автомобиле по государственному номеру. Получение полного досье на автомобиль, включая номера двигателя, кузова и шасси, данные о ДТП и техосмотре.
            </p>
          </div>
          <OwnerInfoByLicensePlate />
        </PermissionGate>
      )}

      {activeTab === 'register' && (
        <PermissionGate 
          resource="owners" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для регистрации новых владельцев
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Регистрация нового владельца транспортного средства в системе.
            </p>
          </div>
          <OwnerForm />
        </PermissionGate>
      )}

      {activeTab === 'list' && (
        <PermissionGate 
          resource="owners" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра списка владельцев
          </div>}
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Полный список владельцев транспортных средств с возможностью редактирования и удаления.
            </p>
          </div>
          <OwnersList />
        </PermissionGate>
      )}
    </div>
  );
}
