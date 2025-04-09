"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Vehicles() {
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    engineVolume: '',
    ownerName: '',
    color: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vehicles', formData);
      alert('Транспортное средство успешно зарегистрировано!');
      router.push('/vehicles'); // Перенаправление на список ТС
    } catch (error) {
      console.error(error);
      alert('Ошибка при регистрации транспортного средства.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация транспортного средства</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="licensePlate"
          placeholder="Госномер"
          value={formData.licensePlate}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="brand"
          placeholder="Марка"
          value={formData.brand}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="model"
          placeholder="Модель"
          value={formData.model}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="year"
          placeholder="Год выпуска"
          value={formData.year}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="engineVolume"
          placeholder="Объем двигателя"
          value={formData.engineVolume}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="ownerName"
          placeholder="ФИО владельца"
          value={formData.ownerName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="color"
          placeholder="Цвет"
          value={formData.color}
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