"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  addVehicle,
  getOwners,
  getOrganizations,
  getBrands,
  getAlarmSystems,
  getLicensePlates,
} from '@/utils/api';
import { Brand, Owner, Organization, AlarmSystem } from '@/types/vehicle';

interface VehicleFormData {
  brandId: number | null; // Используем null для числовых полей
  alarmSystemId: number | null;
  ownerId: number | null;
  organizationId: number | null;
  licensePlateId: number | null;
  releaseDate: string;
  engineVolume: number | null;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
}

interface Suggestion {
  id: number;
  name: string;
}

const prepareFormData = (formData: VehicleFormData): {
  brandId: number;
  alarmSystemId: number;
  ownerId: number;
  organizationId: number;
  licensePlateId: number;
  releaseDate: string;
  engineVolume: number;
  engineNumber: string;
  chassisNumber: string;
  bodyNumber: string;
  color: string;
  vehicleType: string;
} => {
  return {
    brandId: formData.brandId || 0, // Заменяем null на 0
    alarmSystemId: formData.alarmSystemId || 0,
    ownerId: formData.ownerId || 0,
    organizationId: formData.organizationId || 0,
    licensePlateId: formData.licensePlateId || 0,
    releaseDate: formData.releaseDate + 'T00:00:00',
    engineVolume: formData.engineVolume || 0,
    engineNumber: formData.engineNumber,
    chassisNumber: formData.chassisNumber,
    bodyNumber: formData.bodyNumber,
    color: formData.color,
    vehicleType: formData.vehicleType,
  };
};

const AddVehicleForm = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    brandId: null,
    alarmSystemId: null,
    ownerId: null,
    organizationId: null,
    licensePlateId: null,
    releaseDate: '',
    engineVolume: null,
    engineNumber: '',
    chassisNumber: '',
    bodyNumber: '',
    color: '',
    vehicleType: '',
  });

  const [suggestions, setSuggestions] = useState<{
    [key: string]: (Brand | Owner | Organization | AlarmSystem | Suggestion)[];
  }>({
    brand: [],
    alarmSystem: [],
    owner: [],
    organization: [],
    licensePlate: [],
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Преобразуем значение в нужный тип данных
    const parsedValue =
      name === 'engineVolume'
        ? parseFloat(value) || null // Преобразуем в число или null
        : value === '' && ['brandId', 'alarmSystemId', 'ownerId', 'organizationId', 'licensePlateId'].includes(name)
        ? null // Для числовых полей присваиваем null, если значение пустое
        : value;

    if (name === 'brandId') {
      getBrands({ search: value }).then((response) =>
        setSuggestions((prev) => ({ ...prev, brand: response.data }))
      );
    } else if (name === 'alarmSystemId') {
      getAlarmSystems({ search: value }).then((response) =>
        setSuggestions((prev) => ({ ...prev, alarmSystem: response.data }))
      );
    } else if (name === 'ownerId') {
      getOwners({ search: value }).then((response) =>
        setSuggestions((prev) => ({ ...prev, owner: response.data }))
      );
    } else if (name === 'organizationId') {
      getOrganizations({ search: value }).then((response) =>
        setSuggestions((prev) => ({ ...prev, organization: response.data }))
      );
    } else if (name === 'licensePlateId') {
      getLicensePlates({ search: value }).then((response) =>
        setSuggestions((prev) => ({ ...prev, licensePlate: response.data }))
      );
    }

    // Обновляем состояние формы
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSuggestionSelect = (field: string, suggestion: Suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [`${field}Id`]: suggestion.id,
    }));
    setSuggestions((prev) => ({
      ...prev,
      [field]: [], // Очищаем подсказки после выбора
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const preparedData = prepareFormData(formData); // Преобразуем данные
      await addVehicle(preparedData); // Отправляем преобразованные данные
      alert('Vehicle successfully registered!');
      router.push('/vehicles');
    } catch (error) {
      console.error(error);
      alert('Error registering vehicle.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация транспортного средства</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Brand */}
        <input
          type="text"
          name="brandId"
          placeholder="Search for a brand"
          value={formData.brandId || ''} // Преобразуем null в пустую строку
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {suggestions.brand.length > 0 && (
          <ul className="border p-2 w-full">
            {suggestions.brand.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionSelect('brand', suggestion)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {/* Alarm System */}
        <input
          type="text"
          name="alarmSystemId"
          placeholder="Search for an alarm system"
          value={formData.alarmSystemId || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {suggestions.alarmSystem.length > 0 && (
          <ul className="border p-2 w-full">
            {suggestions.alarmSystem.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionSelect('alarmSystem', suggestion)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {/* Owner */}
        <input
          type="text"
          name="ownerId"
          placeholder="Search for an owner"
          value={formData.ownerId || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {suggestions.owner.length > 0 && (
          <ul className="border p-2 w-full">
            {suggestions.owner.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionSelect('owner', suggestion)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {/* Organization */}
        <input
          type="text"
          name="organizationId"
          placeholder="Search for an organization"
          value={formData.organizationId || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {suggestions.organization.length > 0 && (
          <ul className="border p-2 w-full">
            {suggestions.organization.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionSelect('organization', suggestion)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {/* License Plate */}
        <input
          type="text"
          name="licensePlateId"
          placeholder="Search for a license plate"
          value={formData.licensePlateId || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {suggestions.licensePlate.length > 0 && (
          <ul className="border p-2 w-full">
            {suggestions.licensePlate.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionSelect('licensePlate', suggestion)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        {/* Release Date */}
        <input
          type="date"
          name="releaseDate"
          placeholder="Дата выпуска"
          value={formData.releaseDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Engine Volume */}
        <input
          type="number"
          name="engineVolume"
          placeholder="Объем двигателя"
          value={formData.engineVolume || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Engine Number */}
        <input
          type="text"
          name="engineNumber"
          placeholder="Номер двигателя"
          value={formData.engineNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Chassis Number */}
        <input
          type="text"
          name="chassisNumber"
          placeholder="Номер шасси"
          value={formData.chassisNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Body Number */}
        <input
          type="text"
          name="bodyNumber"
          placeholder="Номер кузова"
          value={formData.bodyNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Color */}
        <input
          type="text"
          name="color"
          placeholder="Цвет"
          value={formData.color}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Vehicle Type */}
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Тип ТС</option>
          <option value="PASSENGER">Легковой</option>
          <option value="TRUCK">Грузовой</option>
          <option value="MOTORCYCLE">Мотоцикл</option>
          <option value="BUS">Автобус</option>
          <option value="TRAILER">Прицеп</option>
        </select>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;