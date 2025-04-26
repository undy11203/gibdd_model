// pages/accident-registration.tsx
"use client";

import React from "react";
import AccidentForm from "../../components/forms/AddAccidentForm";
import { AxiosResponse } from "axios";

const AccidentRegistrationPage: React.FC = () => {

  const handleSuccess = (response: AxiosResponse) => {
    console.log(response.data.id);
  };

  return (
    <div className="p-4">
      {/* Кнопка "Назад" */}
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

      {/* Заголовок */}
      <h1 className="text-2xl font-bold mb-4">Регистрация ДТП</h1>

      {/* Форма */}
      <AccidentForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AccidentRegistrationPage;