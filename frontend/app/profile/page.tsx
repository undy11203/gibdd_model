"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!userData) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
      <p><strong>Имя:</strong> {userData.name}</p>
      <p><strong>Роль:</strong> {userData.role}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
}