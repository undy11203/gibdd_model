"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import SuggestionInput from "../input/SuggestionInput"; // Импортируем компонент
import { addWanted, getOwners, getVehicles } from "../../utils/api";

interface WantedFormData {
  vehicleId: number | null;
  addedDate: string;
  reason: string;
  status: "WANTED" | "FOUND";
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
      reason: "",
      status: "WANTED",
      ownerName: "",
      ownerId: null,
    },
  });

  const [vehicles, setVehicles] = React.useState<any[]>([]);
  const ownerId = useWatch({ control, name: "ownerId" });

  // Обновление списка транспортных средств при изменении владельца
  React.useEffect(() => {
    if (ownerId) {
      getVehicles({ ownerId })
        .then((response) => {
          const vehiclesData = response.data.content || response.data;
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
        reason: "",
        status: "WANTED",
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
            className={`border p-2 w-full`}
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
        className={`border p-2 w-full `}
      />

      {/* Причина */}
      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
        Причина
      </label>
      <input
        type="text"
        {...register("reason", { required: "Это поле обязательно" })}
        className={`border p-2 w-full`}
      />

      {/* Статус */}
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
        Статус
      </label>
      <select
        {...register("status", { required: "Это поле обязательно" })}
        className={`border p-2 w-full`}
      >
        <option value="WANTED">Розыскивается</option>
        <option value="FOUND">Найден</option>
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