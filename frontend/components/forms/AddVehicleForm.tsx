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
  validateLicensePlate,
  getVehicleTypeValues,
} from "@/utils/api";
import SuggestionInput from "../input/SuggestionInput"; // Импортируем компонент
// Removed: import { VehicleType } from "@/types/vehicles"; as it's no longer an enum

interface VehicleFormData {
  brandId: number | null;
  alarmSystemId: number | null;
  ownerId: number | null;
  organizationId: number | null;
  licenseNumber: string;
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
  licenseNumber: formData.licenseNumber,
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
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      brandId: null,
      alarmSystemId: null,
      ownerId: null,
      organizationId: null,
      licenseNumber: "",
      licensePlateId: null,
      releaseDate: "",
      engineVolume: null,
      engineNumber: "",
      chassisNumber: "",
      bodyNumber: "",
      color: "",
      vehicleType: "", // Default to empty string
    },
  });

  const [licensePlateValidation, setLicensePlateValidation] = useState<{
    isValid: boolean | null;
  }>({
    isValid: null,
  });

  const [vehicleTypes, setVehicleTypes] = useState<string[]>([""]); // Added

  const [displayValues, setDisplayValues] = useState({
    brandName: "",
    alarmSystemName: "",
    ownerName: "",
    organizationName: "",
  });

  const onSuggestionSelect = (
    suggestion: { id: number; name: string },
    field: "brand" | "alarmSystem" | "owner" | "organization"
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
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const types = await getVehicleTypeValues();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Error fetching vehicle enums", error);
      }
    };
    fetchEnums();
  }, []);

  const validateLicensePlateNumber = async (licenseNumber: string) => {
    if (!licenseNumber) {
      setLicensePlateValidation({
        isValid: null
      });
      setValue("licensePlateId", null);
      return;
    }

    try {
      // Проверяем, что номер соответствует формату и доступен
      const response = await validateLicensePlate(licenseNumber);
      
      if (response) {
        // Если номер валиден, устанавливаем его как доступный
        setLicensePlateValidation({
          isValid: true,
        });
        // Используем сам номерной знак как идентификатор
        setValue("licenseNumber", licenseNumber);
        setValue("licensePlateId", 1); // Временное решение для совместимости с API
      } else {
        setLicensePlateValidation({
          isValid: false,
        });
        setValue("licensePlateId", null);
      }
    } catch (error) {
      console.error("Error validating license plate:", error);
      setLicensePlateValidation({
        isValid: false
      });
      setValue("licensePlateId", null);
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    // Проверка, что все обязательные поля заполнены
    if (
      !data.brandId ||
      !data.alarmSystemId ||
      !(data.ownerId || data.organizationId) ||
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

    console.log(data)

    try {
      // Подготовка данных для отправки
      const preparedData = prepareFormData(data);
      console.log(preparedData)

      // Отправка данных на сервер
      await addVehicle(preparedData);
      reset({
        brandId: null,
        alarmSystemId: null,
        ownerId: null,
        organizationId: null,
        licenseNumber: "",
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
      });
      setLicensePlateValidation({
        isValid: null
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
          placeholder="Марка"
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
          placeholder="Сигнализация"
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
          placeholder="Владелец"
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
          placeholder="Организация"
          value={displayValues.organizationName}
          onChange={(value) => {
            setDisplayValues((prev) => ({ ...prev, organizationName: value }));
            setValue("organizationId", parseFloat(value) || null);
          }}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "organization")}
          fetchData={(search) => getOrganizations({ search })}
        />

        {/* Номерной знак */}
        <div>
          <div>Номерной знак</div>
          <div className="flex flex-col">
            <input
              type="text"
              {...register("licenseNumber", {
                required: "Это поле обязательно",
                onChange: (e) => validateLicensePlateNumber(e.target.value),
              })}
              className={`border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow ${
                licensePlateValidation.isValid === false ? "border-red-500" : 
                licensePlateValidation.isValid === true ? "border-green-500" : ""
              }`}
              placeholder="Введите номерной знак"
            />
          </div>
        </div>

        {/* Дата выпуска */}
        <div>Дата выпуска</div>
        <input
          type="date"
          {...register("releaseDate", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Объем двигателя */}
        <div>Объём двигателя</div>
        <input
          type="number"
          {...register("engineVolume", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Номер двигателя */}
        <div>Номер двигателя</div>
        <input
          type="text"
          {...register("engineNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Номер шасси */}
        <div>Номер шасси</div>
        <input
          type="text"
          {...register("chassisNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Номер кузова */}
        <div>Номер кузова</div>
        <input
          type="text"
          {...register("bodyNumber", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Цвет */}
        <div>Цвет</div>
        <input
          type="text"
          {...register("color", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        />

        {/* Тип ТС */}
        <div>Тип ТС</div>
        <select
          {...register("vehicleType", { required: "Это поле обязательно" })}
          className="border p-2 w-full border shadow-sm border-gray-300 rounded-md p-2 flex-grow"
        >
          <option value="">Тип ТС</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
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
