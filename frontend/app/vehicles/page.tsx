"use client";

import { useState, useEffect } from 'react';
import TabNav from '../../components/common/TabNav';
import AddVehicleForm from '../../components/forms/AddVehicleForm';
import { getVehicles, deleteVehicle } from '../../utils/api/vehicles';
import { Vehicle } from '../../types/vehicles';
import CRUDBrand from '@/components/CRUDBrand';
import CRUDAlarmSystem from '@/components/CRUDAlarmSystem';
import { PermissionGate } from '@/components/common/PermissionGate';
import BackButton from '@/components/common/BackButton';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'register' | 'brand' | 'alarm-system'>('list');

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles({});
      setVehicles(response.content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это транспортное средство?')) {
      try {
        await deleteVehicle(id);
        // Refresh the list after deletion
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Ошибка при удалении транспортного средства');
      }
    }
  };

  const tabs = [
    { id: 'list', label: 'Список' },
    { id: 'register', label: 'Регистрация' },
    { id: 'brand', label: 'Марки машин'},
    { id: 'alarm-system', label: 'Сигнализации'}
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton className="mb-0" />
          <h1 className="text-3xl font-bold">Транспортные средства</h1>
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
          resource="vehicles" 
          action="read"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для просмотра транспортных средств
          </div>}
        >
          <h2 className="text-xl font-semibold mb-4">Список транспортных средств</h2>
          <ul className="space-y-2 mb-6">
            {vehicles != undefined && vehicles.map((vehicle) => (
              <li key={vehicle.id} className="border p-2 rounded flex justify-between items-center border border-gray-300 rounded-md p-2 flex-grow">
                <div>
                  <strong>{vehicle.licensePlate?.licenseNumber ?? 'Unknown License Plate'}</strong> - {vehicle.brand?.name ?? 'Unknown Brand'}, {vehicle.releaseDate}, {vehicle.owner?.fullName ?? 'Unknown Owner'}
                </div>
                <button 
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </PermissionGate>
      )}

      {activeTab === 'register' && (
        <PermissionGate 
          resource="vehicles" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для регистрации транспортных средств
          </div>}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <AddVehicleForm />
          </div>
        </PermissionGate>
      )}

      {activeTab === 'brand' && (
        <PermissionGate 
          resource="vehicles" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для управления марками машин
          </div>}
        >
          <CRUDBrand />
        </PermissionGate>
      )}

      {activeTab === 'alarm-system' && (
        <PermissionGate 
          resource="vehicles" 
          action="write"
          fallback={<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            У вас нет прав для управления сигнализациями
          </div>}
        >
          <CRUDAlarmSystem />
        </PermissionGate>
      )}
    </div>
  );
}
