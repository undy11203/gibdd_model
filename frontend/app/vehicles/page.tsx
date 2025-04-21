"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddVehicleForm from '@/components/forms/AddVehicleForm';
import { getVehicles } from '@/utils/api';
import { Vehicle } from '@/types/type';



export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const router = useRouter();

  useEffect(() => {
const fetchVehicles = async () => {
  try {
const response = await getVehicles({});
setVehicles(response.data.content);
  } catch (error) {
    console.error(error);
  }
};
    fetchVehicles();
  }, []);



  return (
    <div className="p-4">
      <button
        onClick={() => window.history.back()}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <h1 className="text-2xl font-bold mb-4">Транспортные средства</h1>

      <h2 className="text-xl font-semibold mb-2">Список транспортных средств</h2>
      <ul className="space-y-2 mb-6">
        {vehicles != undefined && vehicles.map((vehicle) => (
          <li key={vehicle.id} className="border p-2">
<strong>{vehicle.licensePlate?.licenseNumber ?? 'Unknown License Plate'}</strong> - {vehicle.brand?.name ?? 'Unknown Brand'}, {vehicle.releaseDate}, {vehicle.owner?.fullName ?? 'Unknown Owner'}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Регистрация транспортного средства</h2>
      <AddVehicleForm />
    </div>
  );
}
