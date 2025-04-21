"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addInspection, getOwners, getVehicles } from '@/utils/api';
import { Owner, Vehicle } from '@/types/type';

interface TechnicalInspectionFormData {
  ownerId: number | null; // ID владельца
  vehicleId: number | null; // ID транспортного средства
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

const prepareFormData = (formData: TechnicalInspectionFormData): {
  ownerId: number;
  vehicleId: number;
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
} => {
  return {
    ownerId: formData.ownerId || 0,
    vehicleId: formData.vehicleId || 0,
    inspectionDate: formData.inspectionDate,
    result: formData.result,
    nextInspectionDate: formData.nextInspectionDate,
  };
};

const AddTechnicalInspectionForm = () => {
  const [formData, setFormData] = useState<TechnicalInspectionFormData>({
    ownerId: null,
    vehicleId: null,
    inspectionDate: '',
    result: '',
    nextInspectionDate: '',
  });

  const [ownerSuggestions, setOwnerSuggestions] = useState<Owner[]>([]);
  const [vehicleSuggestions, setVehicleSuggestions] = useState<Vehicle[]>([]);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === 'ownerId') {
      // Проверяем, является ли значение числом
      const numericValue = value ? Number(value) : null;
      if (!isNaN(numericValue)) {
        setFormData((prev) => ({
          ...prev,
          ownerId: numericValue,
        }));
      } else {
        // Если значение некорректное, устанавливаем ownerId в null
        setFormData((prev) => ({
          ...prev,
          ownerId: null,
        }));
      }
  
      // Поиск владельцев
      getOwners({ search: value }).then((response) =>
        setOwnerSuggestions(response.data)
      );
    } else if (name === 'vehicleId') {
      // Обработка выбора транспортного средства
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? null : Number(value),
      }));
    } else {
      // Обновление остальных полей
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOwnerSelect = (owner: Owner) => {
    if (owner) {
      setFormData((prev) => ({
        ...prev,
        ownerId: owner.id,
      }));
      setOwnerSuggestions([]); // Очищаем подсказки для владельцев

      // Загружаем транспортные средства для выбранного владельца
      getVehicles({ owner_id: owner.id }).then((response) =>
        setVehicleSuggestions(response.data)
      );
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setFormData((prev) => ({
      ...prev,
      vehicleId: vehicle.id,
    }));
    setVehicleSuggestions([]); // Очищаем подсказки для транспортных средств
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const preparedData = prepareFormData(formData);
      await addInspection(preparedData);
      alert('Technical inspection successfully registered!');
      router.push('/technical-inspections');
    } catch (error) {
      console.error(error);
      alert('Error registering technical inspection.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация техосмотра</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Owner */}
        <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
          Владелец
        </label>
        <input
          type="text"
          name="ownerId"
          placeholder="Search for an owner"
          value={formData.ownerId !== null ? formData.ownerId.toString() : ''}
          onChange={(e) => {
            const { value } = e.target;
            setFormData((prev) => ({
              ...prev,
              ownerId: value ? Number(value) : null,
            }));
            getOwners({ search: value }).then((response) =>
              setOwnerSuggestions(response.data)
            );
          }}
          className="border p-2 w-full"
        />
        {ownerSuggestions.length > 0 && (
          <ul className="border p-2 w-full max-h-40 overflow-y-auto">
            {ownerSuggestions.map((owner) => (
              <li
                key={owner.id}
                onClick={() => handleOwnerSelect(owner)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {owner.fullName || owner.name || 'Unknown Owner'}
              </li>
            ))}
          </ul>
        )}

        {/* Vehicle */}
        {formData.ownerId && (
          <>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Транспортное средство
            </label>
            <input
              type="text"
              name="vehicleId"
              placeholder="Search for a vehicle"
              value={formData.vehicleId || ''}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {vehicleSuggestions.length > 0 && (
              <ul className="border p-2 w-full max-h-40 overflow-y-auto">
                {vehicleSuggestions.map((vehicle) => (
                  <li
                    key={vehicle.id}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className="cursor-pointer hover:bg-gray-100 p-2"
                  >
                    {`${vehicle.brand?.name ?? 'Unknown Brand'} (${vehicle.licensePlate?.licenseNumber ?? 'Unknown License Plate'})`}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Inspection Date */}
        <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700">
          Дата текущего техосмотра
        </label>
        <input
          type="date"
          name="inspectionDate"
          placeholder="Дата техосмотра"
          value={formData.inspectionDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Result */}
        <label htmlFor="result" className="block text-sm font-medium text-gray-700">
          Результат
        </label>
        <input
          type="text"
          name="result"
          placeholder="Результат"
          value={formData.result}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Next Inspection Date */}
        <label htmlFor="nextInspectionDate" className="block text-sm font-medium text-gray-700">
          Дата следующего техосмотра
        </label>
        <input
          type="date"
          name="nextInspectionDate"
          placeholder="Дата следующего техосмотра"
          value={formData.nextInspectionDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={!formData.vehicleId} // Кнопка активна только при выборе ТС
        >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddTechnicalInspectionForm;