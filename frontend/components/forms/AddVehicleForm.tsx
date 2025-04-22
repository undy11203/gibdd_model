"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  addVehicle,
  getOwners,
  getOrganizations,
  getBrands,
  getAlarmSystems,
  getLicensePlates,
} from "@/utils/api";
import { Brand, Owner, Organization, AlarmSystem } from "@/types/type";

interface VehicleFormData {
  brandId: number | null;
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

interface SuggestionInputProps {
  name: keyof VehicleFormData;
  placeholder: string;
  value: number | null;
  suggestions: Suggestion[];
  onInputChange: (name: keyof VehicleFormData, value: string) => void;
  onSuggestionSelect: (name: keyof VehicleFormData, suggestion: Suggestion) => void;
}

const SuggestionInput = ({
  name,
  placeholder,
  value,
  suggestions,
  onInputChange,
  onSuggestionSelect,
}: SuggestionInputProps) => {
  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value !== null ? String(value) : ""}
        onChange={(e) => onInputChange(name, e.target.value)}
        className="border p-2 w-full"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="border p-2 w-full max-h-40 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onSuggestionSelect(name, suggestion)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const prepareFormData = (formData: VehicleFormData) => ({
  brandId: formData.brandId || 0,
  alarmSystemId: formData.alarmSystemId || 0,
  ownerId: formData.ownerId || 0,
  organizationId: formData.organizationId || 0,
  licensePlateId: formData.licensePlateId || 0,
  releaseDate: formData.releaseDate + "T00:00:00",
  engineVolume: formData.engineVolume || 0,
  engineNumber: formData.engineNumber,
  chassisNumber: formData.chassisNumber,
  bodyNumber: formData.bodyNumber,
  color: formData.color,
  vehicleType: formData.vehicleType,
});

const AddVehicleForm = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    brandId: null,
    alarmSystemId: null,
    ownerId: null,
    organizationId: null,
    licensePlateId: null,
    releaseDate: "",
    engineVolume: null,
    engineNumber: "",
    chassisNumber: "",
    bodyNumber: "",
    color: "",
    vehicleType: "",
  });

  const [suggestions, setSuggestions] = useState<{
    [key in keyof Pick<
      VehicleFormData,
      "brandId" | "alarmSystemId" | "ownerId" | "organizationId" | "licensePlateId"
    >]: Suggestion[];
  }>({
    brandId: [],
    alarmSystemId: [],
    ownerId: [],
    organizationId: [],
    licensePlateId: [],
  });

  const router = useRouter();

  // Fetch suggestions based on field and search value
  const fetchSuggestions = useCallback(
    async (field: keyof typeof suggestions, search: string) => {
      if (!search) {
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        return;
      }
      try {
        let response;
        switch (field) {
          case "brandId":
            response = await getBrands({ search });
            break;
          case "alarmSystemId":
            response = await getAlarmSystems({ search });
            break;
          case "ownerId":
            response = await getOwners({ search });
            break;
          case "organizationId":
            response = await getOrganizations({ search });
            break;
          case "licensePlateId":
            response = await getLicensePlates({ search });
            break;
          default:
            response = { data: [] };
        }
        setSuggestions((prev) => ({ ...prev, [field]: response.data }));
      } catch (error) {
        console.error("Error fetching suggestions for", field, error);
      }
    },
    []
  );

  const handleInputChange = (name: keyof VehicleFormData, value: string) => {
    // For numeric fields, parse to number or null
    const parsedValue =
      name === "engineVolume"
        ? parseFloat(value) || null
        : value === "" &&
          ["brandId", "alarmSystemId", "ownerId", "organizationId", "licensePlateId"].includes(
            name
          )
        ? null
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Fetch suggestions for relevant fields
    if (
      ["brandId", "alarmSystemId", "ownerId", "organizationId", "licensePlateId"].includes(
        name
      )
    ) {
      fetchSuggestions(name as keyof typeof suggestions, value);
    }
  };

  const handleSuggestionSelect = (name: keyof VehicleFormData, suggestion: Suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [name]: suggestion.id,
    }));
    setSuggestions((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.brandId ||
      !formData.alarmSystemId ||
      !formData.ownerId ||
      !formData.organizationId ||
      !formData.licensePlateId ||
      !formData.releaseDate ||
      !formData.engineVolume ||
      !formData.engineNumber ||
      !formData.chassisNumber ||
      !formData.bodyNumber ||
      !formData.color ||
      !formData.vehicleType
    ) {
      alert("Пожалуйста, заполните все поля");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const preparedData = prepareFormData(formData);
      await addVehicle(preparedData);
      alert("Транспортное средство успешно зарегистрировано!");
      router.push("/vehicles");
    } catch (error) {
      console.error(error);
      alert("Ошибка при регистрации транспортного средства.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация транспортного средства</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SuggestionInput
          name="brandId"
          placeholder="Поиск марки"
          value={formData.brandId}
          suggestions={suggestions.brandId}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />
        <SuggestionInput
          name="alarmSystemId"
          placeholder="Поиск сигнализации"
          value={formData.alarmSystemId}
          suggestions={suggestions.alarmSystemId}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />
        <SuggestionInput
          name="ownerId"
          placeholder="Поиск владельца"
          value={formData.ownerId}
          suggestions={suggestions.ownerId}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />
        <SuggestionInput
          name="organizationId"
          placeholder="Поиск организации"
          value={formData.organizationId}
          suggestions={suggestions.organizationId}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />
        <SuggestionInput
          name="licensePlateId"
          placeholder="Поиск номера"
          value={formData.licensePlateId}
          suggestions={suggestions.licensePlateId}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />

        <input
          type="date"
          name="releaseDate"
          placeholder="Дата выпуска"
          value={formData.releaseDate}
          onChange={(e) => handleInputChange("releaseDate", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="engineVolume"
          placeholder="Объем двигателя"
          value={formData.engineVolume !== null ? formData.engineVolume : ""}
          onChange={(e) => handleInputChange("engineVolume", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="engineNumber"
          placeholder="Номер двигателя"
          value={formData.engineNumber}
          onChange={(e) => handleInputChange("engineNumber", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="chassisNumber"
          placeholder="Номер шасси"
          value={formData.chassisNumber}
          onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="bodyNumber"
          placeholder="Номер кузова"
          value={formData.bodyNumber}
          onChange={(e) => handleInputChange("bodyNumber", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="color"
          placeholder="Цвет"
          value={formData.color}
          onChange={(e) => handleInputChange("color", e.target.value)}
          className="border p-2 w-full"
        />

        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={(e) => handleInputChange("vehicleType", e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Тип ТС</option>
          <option value="PASSENGER">Легковой</option>
          <option value="TRUCK">Грузовой</option>
          <option value="MOTORCYCLE">Мотоцикл</option>
          <option value="BUS">Автобус</option>
          <option value="TRAILER">Прицеп</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
