"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addInspection, getOwners, getVehicles } from "@/utils/api";
import { Owner, Vehicle } from "@/types";
import SuggestionInput from "../input/SuggestionInput"; // Импортируем компонент

interface TechnicalInspectionFormData {
  ownerName: string; // Поле для поиска владельца
  ownerId: number | null; // ID выбранного владельца
  vehicleId: number | null; // ID выбранного транспортного средства
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

const prepareFormData = (formData: TechnicalInspectionFormData) => ({
  ownerId: formData.ownerId || 0,
  vehicleId: formData.vehicleId || 0,
  inspectionDate: formData.inspectionDate,
  result: formData.result,
  nextInspectionDate: formData.nextInspectionDate,
});

const AddTechnicalInspectionForm = () => {
  const { register, handleSubmit, setValue, control, reset } = useForm<TechnicalInspectionFormData>({
    defaultValues: {
      ownerName: "",
      ownerId: null,
      vehicleId: null,
      inspectionDate: "",
      result: "",
      nextInspectionDate: "",
    },
  });

  const ownerId = useWatch({ control, name: "ownerId" });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Обновление списка транспортных средств при изменении владельца
  useEffect(() => {
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

  // Обработчик выбора подсказки
  const onSuggestionSelect = (suggestion: { id: number; name: string }, field: "owner") => {
    if (field === "owner") {
      setValue("ownerName", suggestion.name);
      setValue("ownerId", suggestion.id);
      setValue("vehicleId", null);
    }
  };

  // Обработчик отправки формы
  const onSubmit = async (data: TechnicalInspectionFormData) => {
    try {
      const preparedData = prepareFormData(data);
      await addInspection(preparedData);
      reset({
        ownerName: "",
        ownerId: null,
        vehicleId: null,
        inspectionDate: "",
        result: "",
        nextInspectionDate: ""
      });
      setVehicles([]);
      alert("Техосмотр успешно зарегистрирован!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при регистрации техосмотра.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация техосмотра</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Владелец */}
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
          Владелец
        </label>
        <SuggestionInput
          placeholder="Поиск владельца"
          value={(useWatch({ control, name: "ownerName" }) ?? "") as string}
          onChange={(value) => setValue("ownerName", value)}
          onSelect={(suggestion) => onSuggestionSelect(suggestion, "owner")}
          fetchData={(search) => getOwners({ search })}
        />

        {/* Транспортное средство */}
        {ownerId !== null && (
          <>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Транспортное средство
            </label>
            <select
              {...register("vehicleId", { valueAsNumber: true })}
              className="border p-2 w-full"
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

        {/* Дата текущего техосмотра */}
        <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700">
          Дата текущего техосмотра
        </label>
        <input
          type="date"
          {...register("inspectionDate", { required: "Это поле обязательно" })}
          className={`border p-2 w-full`}
        />

        {/* Результат */}
        <label htmlFor="result" className="block text-sm font-medium text-gray-700">
          Результат
        </label>
        <input
          type="text"
          {...register("result", { required: "Это поле обязательно" })}
          className={`border p-2 w-full`}
        />

        {/* Дата следующего техосмотра */}
        <label htmlFor="nextInspectionDate" className="block text-sm font-medium text-gray-700">
          Дата следующего техосмотра
        </label>
        <input
          type="date"
          {...register("nextInspectionDate", { required: "Это поле обязательно" })}
          className={`border p-2 w-full`}
        />

        {/* Кнопка отправки */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4" >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddTechnicalInspectionForm;