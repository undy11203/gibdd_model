"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateLicensePlate, getHotLicensePlates } from "@/utils/api";

export default function LicensePlateValidationPage() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hotPlates, setHotPlates] = useState<Array<{ licenseNumber: string; status: boolean }>>([]);

  const router = useRouter();

  async function validateLicensePlateHandler() {
    setError(null);
    setValidationResult(null);
    if (!licenseNumber) {
      setError("Введите номер для проверки");
      return;
    }
    try {
      const response = await validateLicensePlate(licenseNumber);
      if (response.status !== 200) {
        setError("Ошибка при проверке номера");
        return;
      }
      const isValid = response.data;
      setValidationResult(isValid ? "Номер корректен" : "Номер некорректен");
    } catch (e) {
      setError("Ошибка сети при проверке номера");
    }
  }

  async function fetchHotPlates() {
    try {
      const response = await getHotLicensePlates();
      if (response.status !== 200) {
        setError("Ошибка при загрузке горячих номеров");
        return;
      }
      const data = response.data;
      setHotPlates(data);
    } catch (e) {
      setError("Ошибка сети при загрузке горячих номеров");
    }
  }

  useEffect(() => {
    fetchHotPlates();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        aria-label="Вернуться назад"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 inline-block"
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
    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Проверка корректности номера</h1>
      <input
        type="text"
        placeholder="Введите номер"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={validateLicensePlateHandler}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-4"
      >
        Проверить
      </button>
      {validationResult && <p className="mt-4 font-semibold">{validationResult}</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-2">Горячие номера</h2>
      {hotPlates.length === 0 ? (
        <p>Нет доступных номеров</p>
      ) : (
        <ul className="list-disc list-inside">
          {hotPlates.map((plate) => (
            <li key={plate.licenseNumber}>
              {plate.licenseNumber} - {plate.status ? "Свободен" : "Занят"}
            </li>
          ))}
        </ul>
      )}

    </div>
    </div>
  );
}
