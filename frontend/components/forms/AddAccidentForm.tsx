// components/AccidentForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { addAccident } from "@/utils/api";

interface AccidentFormData {
  date: string;
  latitude: string;
  longitude: string;
  type: string;
  briefDescription: string;
  numberOfVictims: string;
  damageAmount: string;
  reason: string;
  roadConditions: string;
}

const prepareFormData = (formData: AccidentFormData) => ({
  date: formData.date,
  location: {
    lat: parseFloat(formData.latitude),
    lng: parseFloat(formData.longitude),
  },
  type: formData.type,
  briefDescription: formData.briefDescription,
  numberOfVictims: parseInt(formData.numberOfVictims, 10),
  damageAmount: parseFloat(formData.damageAmount),
  reason: formData.reason,
  roadConditions: formData.roadConditions,
});

interface AccidentFormProps {
    onSuccess?: (data: any) => void; // Колбэк для успешного создания ДТП
  }

const AccidentForm: React.FC<AccidentFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccidentFormData>({
    defaultValues: {
      date: "",
      latitude: "",
      longitude: "",
      type: "",
      briefDescription: "",
      numberOfVictims: "",
      damageAmount: "",
      reason: "",
      roadConditions: "",
    },
  });

  const onSubmit = async (data: AccidentFormData) => {
    try {
      const preparedData = prepareFormData(data);
      const response = await addAccident(preparedData);
      alert("ДТП успешно зарегистрировано!");
      reset({
        date: "",
        latitude: "",
        longitude: "",
        type: "",
        briefDescription: "",
        numberOfVictims: "",
        damageAmount: "",
        reason: "",
        roadConditions: ""
      });
      if (onSuccess) onSuccess(response);

    } catch (error) {
      console.error(error);
      alert("Ошибка при регистрации ДТП.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Дата */}
      <div>
        <label htmlFor="date" className="block mb-1 font-medium">
          Дата
        </label>
        <input
          type="date"
          id="date"
          {...register("date", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Широта */}
      <div>
        <label htmlFor="latitude" className="block mb-1 font-medium">
          Широта
        </label>
        <input
          type="number"
          step="any"
          id="latitude"
          {...register("latitude", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Долгота */}
      <div>
        <label htmlFor="longitude" className="block mb-1 font-medium">
          Долгота
        </label>
        <input
          type="number"
          step="any"
          id="longitude"
          {...register("longitude", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Тип ДТП */}
      <div>
        <label htmlFor="type" className="block mb-1 font-medium">
          Тип ДТП
        </label>
        <input
          type="text"
          id="type"
          {...register("type", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Краткое описание */}
      <div>
        <label htmlFor="briefDescription" className="block mb-1 font-medium">
          Краткое описание
        </label>
        <textarea
          id="briefDescription"
          {...register("briefDescription", { required: "Это поле обязательно" })}
          rows={3}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Количество пострадавших */}
      <div>
        <label htmlFor="numberOfVictims" className="block mb-1 font-medium">
          Количество пострадавших
        </label>
        <input
          type="number"
          id="numberOfVictims"
          {...register("numberOfVictims", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Сумма ущерба */}
      <div>
        <label htmlFor="damageAmount" className="block mb-1 font-medium">
          Сумма ущерба
        </label>
        <input
          type="number"
          id="damageAmount"
          {...register("damageAmount", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Причина */}
      <div>
        <label htmlFor="reason" className="block mb-1 font-medium">
          Причина
        </label>
        <input
          type="text"
          id="reason"
          {...register("reason", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Дорожные условия */}
      <div>
        <label htmlFor="roadConditions" className="block mb-1 font-medium">
          Дорожные условия
        </label>
        <input
          type="text"
          id="roadConditions"
          {...register("roadConditions", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        />
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Регистрация
      </button>
    </form>
  );
};

export default AccidentForm;