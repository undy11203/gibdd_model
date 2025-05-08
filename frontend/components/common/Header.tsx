"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logout } from '../../utils/api/auth';

export default function Header() {
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // First clear local state and cookies
      authLogout();
      
      // Then make the API call
      await logout();
      
      // Finally redirect
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if API call fails, ensure we redirect to login
      router.push('/login');
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Информационная система ГИБДД</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{user.fullName}</span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
