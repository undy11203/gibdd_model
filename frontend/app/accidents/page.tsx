"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addAccident, getAccidents } from '@/utils/api';

interface Accident {
  id: string;
  date: string;
  type: string;
  location: string;
  vehicles: string;
  victims: string;
  damage: string;
}

interface FormData {
  date: string;
  type: string;
  location: string;
  vehicles: string;
  victims: string;
  damage: string;
}

export default function Accidents() {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [formData, setFormData] = useState<FormData>({
    date: '',
    type: '',
    location: '',
    vehicles: '',
    victims: '',
    damage: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
const response = await getAccidents({ date_from: '', date_to: '', type: '', page: 1, limit: 10 });
        setAccidents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccidents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
await addAccident({
  date: formData.date,
  location: { lat: 0, lng: 0 }, // Assuming default values for lat and lng
  type: formData.type,
  briefDescription: formData.location,
  numberOfVictims: parseInt(formData.victims),
  damageAmount: parseFloat(formData.damage),
  reason: '',
  roadConditions: ''
});
      alert('ДТП успешно зарегистрировано!');
      // Обновляем список ДТП
const response = await getAccidents({ date_from: '', date_to: '', type: '', page: 1, limit: 10 });
      setAccidents(response.data);
      // Очищаем форму
      setFormData({
        date: '',
        type: '',
        location: '',
        vehicles: '',
        victims: '',
        damage: '',
      });
    } catch (error) {
      console.error(error);
      alert('Ошибка при регистрации ДТП.');
    }
  };

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
      <h1 className="text-2xl font-bold mb-4">ДТП</h1>
      
      <h2 className="text-xl font-semibold mb-2">Список ДТП</h2>
      <ul className="space-y-2 mb-6">
        {accidents.map((accident) => (
          <li key={accident.id} className="border p-2">
            <strong>Дата: {accident.date}</strong> - Тип: {accident.type}, Место: {accident.location}
          </li>
        ))}
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">Регистрация ДТП</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="type"
          placeholder="Тип ДТП"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Место происшествия"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="vehicles"
          placeholder="Госномера участников"
          value={formData.vehicles}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="victims"
          placeholder="Число пострадавших"
          value={formData.victims}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="damage"
          placeholder="Сумма ущерба"
          value={formData.damage}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Зарегистрировать
        </button>
      </form>
    </div>
  );
}
