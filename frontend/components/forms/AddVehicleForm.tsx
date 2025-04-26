"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  addVehicle,
  getOwners,
  getOrganizations,
  getBrands,
  getAlarmSystems,
  getLicensePlates,
} from "@/utils/api";
import SuggestionInput from "../input/SuggestionInput"; // Импортируем компонент

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
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
  } = useForm<VehicleFormData>({
    defaultValues: {
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
    },
  });

  const [displayValues, setDisplayValues] = useState({
    brandName: "",
    alarmSystemName: "",
    ownerName: "",
    organizationName: "",
    licensePlateName: "",
  });

  const onSuggestionSelect = (
    suggestion: { id: number; name: string },
    field: "brand" | "alarmSystem" | "owner" | "organization" | "licensePlate"
  ) => {
    switch (field) {
      case "brand":
        setValue("brandId", suggestion.id);
        setDisplayValues((prev) => ({ ...prev, brandName: suggestion.name }));
        break;
      case "alarmSystem":
        setValue("alarmSystemId", suggestion.id);
        setDisplayValues((prev) => ({ ...prev, alarmSystemName: suggestion.name }));
        break;
      case "owner":
        setValue("ownerId", suggestion.id);
        setDisplayValues((prev) => ({ ...prev, ownerName: suggestion.name }));
        break;
      case "organization":
        setValue("organizationId", suggestion.id);
        setDisplayValues((prev) => ({ ...prev, organizationName: suggestion.name }));
        break;
      case "licensePlate":
        setValue("licensePlateId", suggestion.id);
        setDisplayValues((prev) => ({ ...prev, licensePlateName: suggestion.name }));
        break;
      default:
        break;
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    // Проверка, что все обязательные поля заполнены
    if (
      !data.brandId ||
      !data.alarmSystemId ||
      !data.ownerId ||
      !data.organizationId ||
      !data.licensePlateId ||
      !data.releaseDate ||
      !data.engineVolume ||
      !data.engineNumber ||
      !data.chassisNumber ||
      !data.bodyNumber ||
      !data.color ||
      !data.vehicleType
    ) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      // Подготовка данных для отправки
      const preparedData = prepareFormData(data);

      // Отправка данных на сервер
      await addVehicle(preparedData);
      reset({
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
      setDisplayValues({
        brandName: "",
        alarmSystemName: "",
        ownerName: "",
        organizationName: "",
        licensePlateName: "",
      });

      // Успех: очистка формы и перенаправление
      alert("Транспортное средство успешно зарегистрировано!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при регистрации транспортного средства.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация транспортного средства</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Марка */}
        <SuggestionInput
          placeholder="Поиск марки"
          value={displayValues.brandName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, brandName: value }));
            setValue("brandId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "brand")}
          fetchData={(search) => getBrands({ search })}
        />

        {/* Сигнализация */}
        <SuggestionInput
          placeholder="Поиск сигнализации"
          value={displayValues.alarmSystemName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, alarmSystemName: value }));
            setValue("alarmSystemId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "alarmSystem")}
          fetchData={(search) => getAlarmSystems({ search })}
        />

        {/* Владелец */}
        <SuggestionInput
          placeholder="Поиск владельца"
          value={displayValues.ownerName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, ownerName: value }));
            setValue("ownerId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "owner")}
          fetchData={(search) => getOwners({ search })}
        />

        {/* Организация */}
        <SuggestionInput
          placeholder="Поиск организации"
          value={displayValues.organizationName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, organizationName: value }));
            setValue("organizationId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "organization")}
          fetchData={(search) => getOrganizations({ search })}
        />

        {/* Номерной знак */}
        <SuggestionInput
          placeholder="Поиск номера"
          value={displayValues.licensePlateName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, licensePlateName: value }));
            setValue("licensePlateId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "licensePlate")}
          fetchData={(search) => getLicensePlates({ search })}
        />

        {/* Дата выпуска */}
        <input
          type="date"
          {...register("releaseDate", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Объем двигателя */}
        <input
          type="number"
          {...register("engineVolume", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Номер двигателя */}
        <input
          type="text"
          {...register("engineNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Номер шасси */}
        <input
          type="text"
          {...register("chassisNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Номер кузова */}
        <input
          type="text"
          {...register("bodyNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Цвет */}
        <input
          type="text"
          {...register("color", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        />

        {/* Тип ТС */}
        <select
          {...register("vehicleType", { required: "Это поле обязательно" })}
          className="border p-2 w-full"
        >
          <option value="">Тип ТС</option>
          <option value="PASSENGER">Легковой</option>
          <option value="TRUCK">Грузовой</option>
          <option value="MOTORCYCLE">Мотоцикл</option>
          <option value="BUS">Автобус</option>
          <option value="TRAILER">Прицеп</option>
        </select>

        {/* Кнопка отправки */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;