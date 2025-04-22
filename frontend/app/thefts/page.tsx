"use client";

import React, { useState } from 'react';
import { addTheft } from '../../utils/api';

const TheftRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    theftDate: '',
    lat: '',
    lng: '',
    description: '',
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
      await addTheft({
        vehicleId: Number(formData.vehicleId),
        theftDate: formData.theftDate,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        },
        description: formData.description,
      });
      setSuccessMessage('Theft registered successfully.');
      setFormData({
        vehicleId: '',
        theftDate: '',
        lat: '',
        lng: '',
        description: '',
      });
    } catch (error) {
      setErrorMessage('Failed to register theft. Please try again.');
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
      <h1 className="text-2xl font-bold mb-4">Регистрация угона</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="vehicleId" className="block mb-1 font-medium">ID Транспортного средства</label>
          <input
            type="number"
            id="vehicleId"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="theftDate" className="block mb-1 font-medium">Дата угона</label>
          <input
            type="date"
            id="theftDate"
            name="theftDate"
            value={formData.theftDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lat" className="block mb-1 font-medium">Широта</label>
          <input
            type="number"
            step="any"
            id="lat"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lng" className="block mb-1 font-medium">Долгота</label>
          <input
            type="number"
            step="any"
            id="lng"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-medium">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
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

export default TheftRegistrationPage;
