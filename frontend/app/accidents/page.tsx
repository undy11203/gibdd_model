"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Accidents() {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    location: '',
    vehicles: '',
    victims: '',
    damage: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/accidents', formData);
      alert('ДТП успешно зарегистрировано!');
      router.push('/accidents');
    } catch (error) {
      console.error(error);
      alert('Ошибка при регистрации ДТП.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация ДТП</h1>
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