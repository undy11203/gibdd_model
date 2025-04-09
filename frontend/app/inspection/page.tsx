"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Inspection() {
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const response = await axios.get('/api/inspection');
        setInspections(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInspections();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Техосмотр</h1>
      <ul className="space-y-2">
        {inspections.map((inspection) => (
          <li key={inspection.id} className="border p-2">
            <strong>{inspection.vehicleLicensePlate}</strong> - Дата: {inspection.date}, Статус: {inspection.passed ? 'Пройден' : 'Не пройден'}
          </li>
        ))}
      </ul>
    </div>
  );
}