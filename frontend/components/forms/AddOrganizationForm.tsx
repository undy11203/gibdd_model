"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addOrganization } from '@/utils/api';

export default function AddOrganizationForm() {
const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [director, setDirector] = useState('');
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOrganization({ name, district, address, director });
      router.push('/organizations');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
<input
          type="text"
          id="name"
          placeholder="Название организации"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="district"
          placeholder="Район"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="address"
          placeholder="Адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="director"
          placeholder="Директор"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Добавить организацию
      </button>
    </form>
  );
}
