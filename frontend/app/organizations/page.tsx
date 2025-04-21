"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddOrganizationForm from '@/components/forms/AddOrganizationForm';
import { getOrganizations } from '@/utils/api';
import { Organization } from '@/types/type';

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizations({});
        setOrganizations(response.data.content);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrganizations();
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

      <h2 className="text-xl font-semibold mb-2">Список организаций</h2>
      <ul className="space-y-2 mb-6">
        {organizations != undefined && organizations.map((organization) => (
          <li key={organization.id} className="border p-2">
<strong>{organization.name}</strong> - {organization.district}, {organization.address}, Директор: {organization.director}
<pre>{JSON.stringify(organization, null, 2)}</pre>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Регистрация организации</h2>
      <AddOrganizationForm />
    </div>
  );
}
