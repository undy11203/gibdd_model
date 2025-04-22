"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrganizations, getVehicles } from '@/utils/api';
import { Organization, Vehicle } from '@/types/type';

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgResponse = await getOrganizations({});
        setOrganizations(orgResponse.data.content || orgResponse.data);

        const vehResponse = await getVehicles({});
        setVehicles(vehResponse.data.content || vehResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
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
      <h1 className="text-2xl font-bold mb-4">Организации</h1>

      <h2 className="text-xl font-semibold mb-2">Список организаций с транспортом</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Название</th>
            <th className="border px-4 py-2">Район</th>
            <th className="border px-4 py-2">Адрес</th>
            <th className="border px-4 py-2">Директор</th>
            <th className="border px-4 py-2">Транспорт</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org: Organization) => (
            <tr key={org.id} className="border-t">
              <td className="border px-4 py-2">{org.name}</td>
              <td className="border px-4 py-2">{org.district}</td>
              <td className="border px-4 py-2">{org.address}</td>
              <td className="border px-4 py-2">{org.director}</td>
              <td className="border px-4 py-2">
                {vehicles.filter((vehicle) => vehicle?.organization && vehicle.organization.id === org.id).length > 0 ? (
                  <ul>
                    {vehicles
                      .filter((vehicle) => vehicle?.organization && vehicle.organization.id === org.id)
                      .map((vehicle) => (
                        <li key={vehicle.id}>
                          {vehicle.licensePlate?.licenseNumber ?? 'No Plate'} - {vehicle.brand?.name ?? 'No Brand'}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <span>Нет транспорта</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
