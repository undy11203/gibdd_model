"use client";

import React, { useState, useEffect } from "react"; // Added useState, useEffect
import { useForm, useWatch } from "react-hook-form";
import SuggestionInput from "../input/SuggestionInput"; // Импортируем компонент
import { addWanted, getOwners, getVehicles, getWantedStatusValues } from "../../utils/api"; // Added getWantedStatusValues
// Removed WantedReason, WantedStatus imports

interface WantedFormData {
  vehicleId: number | null;
  addedDate: string;
  reason: string; // Was WantedReason
  status: string; // Was WantedStatus
  ownerName: string;
  ownerId: number | null;
}

const AddWantedForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<WantedFormData>({
    defaultValues: {
      vehicleId: null,
      addedDate: "",
      reason: "Угон", // Default to a common reason string, as enum is removed
      status: "", // Default to empty, will be populated by fetched data
      ownerName: "",
      ownerId: null,
    },
  });

  const [vehicles, setVehicles] = React.useState<any[]>([]);
  const ownerId = useWatch({ control, name: "ownerId" });
  const [wantedStatusOptions, setWantedStatusOptions] = useState<string[]>([]); // Added

  // Обновление списка транспортных средств при изменении владельца
  React.useEffect(() => {
    if (ownerId) {
      getVehicles({ ownerId })
        .then((response) => {
          const vehiclesData = response.content;
          setVehicles(vehiclesData);
        })
        .catch((error) => {
          console.error("Error fetching vehicles for owner", error);
          setVehicles([]);
        });
    } else {
      setVehicles([]);
      setValue("vehicleId", null);
    }
  }, [ownerId, setValue]);

  useEffect(() => {
    const fetchStatusEnums = async () => {
      try {
        const statuses = await getWantedStatusValues();
        setWantedStatusOptions(statuses);
      } catch (error) {
        console.error("Error fetching wanted statuses", error);
      }
    };
    fetchStatusEnums();
  }, []);

  // Обработчик выбора подсказки
  const onSuggestionSelect = (suggestion: { id: number; name: string }) => {
    setValue("ownerName", suggestion.name);
    setValue("ownerId", suggestion.id);
    setValue("vehicleId", null);
  };

  // Обработчик отправки формы
  const onSubmit = async (data: WantedFormData) => {
    try {
      await addWanted({
        vehicleId: data.vehicleId || 0,
        addedDate: data.addedDate + "T00:00:00",
        reason: data.reason,
        status: data.status,
      });
      reset({
        vehicleId: null,
        addedDate: "",
        reason: "Угон", // Replaced WantedReason.THEFT with string literal
        status: "", // Replaced WantedStatus.WANTED, reset to empty or a default string
        ownerName: "",
        ownerId: null,
      });
      setVehicles([]);
      alert("Транспортное средство успешно добавлено в розыск!");
    } catch (error) {
      alert("Ошибка при добавлении транспортного средства в розыск.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-3xl mx-auto space-y-4">
      {/* Владелец */}
      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
        Владелец
      </label>
      <SuggestionInput
        placeholder="Поиск владельца"
        value={(useWatch({ control, name: "ownerName" }) ?? "") as string}
        onChange={(value) => setValue("ownerName", value)}
        onSelect={onSuggestionSelect}
        fetchData={(search) => getOwners({ search })}
      />

      {/* Транспортное средство */}
      {ownerId !== null && (
        <>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
            Транспортное средство
          </label>
          <select
            {...register("vehicleId", { valueAsNumber: true, required: "Это поле обязательно" })}
            className={`border p-2 w-full shadow-sm border border-gray-300 rounded-md p-2 flex-grow`}
            disabled={!ownerId}
          >
            <option value="">Выберите транспортное средство</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {`${vehicle.brand?.name ?? "Unknown Brand"} (${
                  vehicle.licensePlate?.licenseNumber ?? "Unknown License Plate"
                })`}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Дата добавления */}
      <label htmlFor="addedDate" className="block text-sm font-medium text-gray-700">
        Дата добавления
      </label>
      <input
        type="date"
        {...register("addedDate", { required: "Это поле обязательно" })}
        className={`border p-2 w-full shadow-sm border border-gray-300 rounded-md p-2 flex-grow `}
      />

      {/* Причина */}
      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
        Причина
      </label>
      <select
        {...register("reason", { required: "Это поле обязательно" })}
        className={`border p-2 w-full shadow-sm border border-gray-300 rounded-md p-2 flex-grow`}
      >
        {/* Hardcoded string options as WantedReason enum is removed and not fetched */}
        <option value="Угон">Угон</option>
        <option value="Скрылся с места ДТП">Скрылся с места ДТП</option>
      </select>

      {/* Статус */}
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
        Статус
      </label>
      <select
        {...register("status", { required: "Это поле обязательно" })}
        className={`border p-2 w-full shadow-sm border border-gray-300 rounded-md p-2 flex-grow`}
      >
        <option value="">Выберите статус</option>
        {wantedStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
        ))}
      </select>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Добавить в розыск
      </button>
    </form>
  );
};

export default AddWantedForm;
