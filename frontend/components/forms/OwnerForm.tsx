// components/OwnerForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { addOwner } from '@/utils/api';

interface OwnerFormData {
  fullName: string;
  address: string;
  phone: string;
}

const OwnerForm = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<OwnerFormData>();

  const onSubmit = async (data: OwnerFormData) => {
    await addOwner(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Поле ФИО */}
      <div>
        <label htmlFor="fullName" className="block mb-1 font-medium">
          ФИО
        </label>
        <input
          type="text"
          id="fullName"
          {...register("fullName", { required: true })}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      {/* Поле Адрес */}
      <div>
        <label htmlFor="address" className="block mb-1 font-medium">
          Адрес
        </label>
        <input
          id="address"
          {...register("address", { required: true })}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      {/* Поле Телефон */}
      <div>
        <label htmlFor="phone" className="block mb-1 font-medium">
          Телефон
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone", { required: true })}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Зарегистрировать
      </button>
    </form>
  );
};

export default OwnerForm;