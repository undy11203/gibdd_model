"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '../../utils/api/auth';
import { RegisterRequest } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import TabNav from '../../components/common/TabNav';
import AddOrganizationForm from '../../components/forms/AddOrganizationForm';

export default function Registration() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'user' | 'organization'>('user');

  const tabs = [
    { id: 'user', label: 'Регистрация пользователя' },
    { id: 'organization', label: 'Создание организации' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await register(formData);
      authLogin(response); // Log in the user after successful registration
      router.push('/');
    } catch (error) {
      setError('Ошибка при регистрации. Возможно, пользователь уже существует.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Регистрация
          </h2>
        </div>

        <div className="mb-6">
          <TabNav 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)} 
          />
        </div>
        {activeTab === 'user' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                name="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="fullName"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Полное имя"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
          </form>
        )}

        {activeTab === 'organization' && (
          <div className="mt-8">
            <AddOrganizationForm />
          </div>
        )}

        <div className="text-sm text-center mt-6">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
