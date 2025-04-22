"use client";

import React, { useState } from 'react';
import { addAccident } from '../../utils/api';

const AccidentRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    latitude: '',
    longitude: '',
    type: '',
    briefDescription: '',
    numberOfVictims: '',
    damageAmount: '',
    reason: '',
    roadConditions: '',
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
      await addAccident({
        date: formData.date,
        location: {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude),
        },
        type: formData.type,
        briefDescription: formData.briefDescription,
        numberOfVictims: Number(formData.numberOfVictims),
        damageAmount: Number(formData.damageAmount),
        reason: formData.reason,
        roadConditions: formData.roadConditions,
      });
      setSuccessMessage('Accident registered successfully.');
      setFormData({
        date: '',
        latitude: '',
        longitude: '',
        type: '',
        briefDescription: '',
        numberOfVictims: '',
        damageAmount: '',
        reason: '',
        roadConditions: '',
      });
    } catch (error) {
      setErrorMessage('Failed to register accident. Please try again.');
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
      <h1 className="text-2xl font-bold mb-4">Регистрация ДТП</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-1 font-medium">Дата</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="latitude" className="block mb-1 font-medium">Широта</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="longitude" className="block mb-1 font-medium">Долгота</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block mb-1 font-medium">Тип ДТП</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="briefDescription" className="block mb-1 font-medium">Краткое описание</label>
          <textarea
            id="briefDescription"
            name="briefDescription"
            value={formData.briefDescription}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfVictims" className="block mb-1 font-medium">Количество пострадавших</label>
          <input
            type="number"
            id="numberOfVictims"
            name="numberOfVictims"
            value={formData.numberOfVictims}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="damageAmount" className="block mb-1 font-medium">Сумма ущерба</label>
          <input
            type="number"
            id="damageAmount"
            name="damageAmount"
            value={formData.damageAmount}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reason" className="block mb-1 font-medium">Причина</label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roadConditions" className="block mb-1 font-medium">Дорожные условия</label>
          <input
            type="text"
            id="roadConditions"
            name="roadConditions"
            value={formData.roadConditions}
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

export default AccidentRegistrationPage;
