"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Wanted() {
  const [wantedVehicles, setWantedVehicles] = useState([]);

  useEffect(() => {
    const fetchWantedVehicles = async () => {
      try {
        const response = await axios.get('/api/wanted');
        setWantedVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWantedVehicles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Розыск угнанных ТС</h1>
      <ul className="space-y-2">
        {wantedVehicles.map((vehicle) => (
          <li key={vehicle.id} className="border p-2">
            <strong>{vehicle.licensePlate}</strong> - {vehicle.brand} {vehicle.model}, Угон: {vehicle.stolenDate}
          </li>
        ))}
      </ul>
    </div>
  );
}