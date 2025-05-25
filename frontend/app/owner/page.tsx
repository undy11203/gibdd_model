'use client';

import { useState } from 'react';
import TabNav from '../../components/common/TabNav';
import BackButton from '../../components/common/BackButton';
import OwnerForm from '../../components/forms/OwnerForm';
import OwnerInfoByLicensePlate from '../../components/pro_search/OwnerInfoByLicensePlate';

const tabs = [
  { id: 'search', label: 'Поиск информации' },
  { id: 'register', label: 'Регистрация владельца' }
];

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'register'>('search');

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
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Поиск информации о владельце и автомобиле по государственному номеру. Получение полного досье на автомобиль, включая номера двигателя, кузова и шасси, данные о ДТП и техосмотре.
            </p>
          </div>
          <OwnerInfoByLicensePlate />
        </>
      )}

      {activeTab === 'register' && (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Регистрация нового владельца транспортного средства в системе.
            </p>
          </div>
          <OwnerForm />
        </>
      )}
    </div>
  );
}
