"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('/api/organizations');
        setOrganizations(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Список организаций</h1>
      <ul className="space-y-2">
        {organizations.map((org) => (
          <li key={org.id} className="border p-2">
            <strong>{org.name}</strong> - {org.address}
          </li>
        ))}
      </ul>
    </div>
  );
}