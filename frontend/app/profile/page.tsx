"use client";

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/utils/api';

interface UserProfile {
  name: string;
  role: string;
  email: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
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
      d="M10 18a.75.75 0 01-.75-.75V4.612l-2.47 2.47a.75.75 0 01-1.06-1.06l3.5-3.5a.75.75 0 011.06 0l3.5 3.5a.75.75 0 11-1.06 1.06l-2.47-2.47V17.25A.75.75 0 0110 18z"
      clipRule="evenodd"
    />
  </svg>
</button>
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
      <p><strong>Имя:</strong> {userData.name}</p>
      <p><strong>Роль:</strong> {userData.role}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
}
