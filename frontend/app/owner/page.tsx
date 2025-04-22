"use client";

import React, { useState } from 'react';
import { addOwner, OwnerData } from '../../utils/api';

const OwnerRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<OwnerData>({
    fullName: '',
    address: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await addOwner(formData);
      setSuccessMessage('Owner registered successfully.');
      setFormData({ fullName: '', address: '', phone: '' });
    } catch (error) {
      setErrorMessage('Failed to register owner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => window.history.back()}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        aria-label="Go back"
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
      <h1 className="text-2xl font-bold mb-4">Регистрация владельца</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 font-medium">ФИО</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-1 font-medium">Адрес</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1 font-medium">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Регистрация...' : 'Зарегистрировать'}
        </button>
      </form>
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default OwnerRegistrationPage;
