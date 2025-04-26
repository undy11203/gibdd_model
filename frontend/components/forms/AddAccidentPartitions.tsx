// components/AddAccidentParticipantsForm.tsx
"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import SuggestionInput from "../input/SuggestionInput";
import { addAccidentParticipant, getOwners } from "@/utils/api";

interface ParticipantFormData {
  ownerId: number | null;
  role: string;
  ownerName: string;
}

const AddAccidentParticipantsForm: React.FC<{ accidentId: number; onSuccess?: () => void }> = ({
  accidentId,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<ParticipantFormData>({
    defaultValues: {
      ownerId: null,
      role: "",
    },
  });


  const onSubmit = async (data: ParticipantFormData) => {
    if (!data.ownerId || !data.role) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      await addAccidentParticipant(accidentId, {
        ownerId: data.ownerId,
        role: data.role,
      });
      alert("Участник успешно добавлен!");
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении участника.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Выбор владельца */}
      <SuggestionInput
        value={(useWatch({ control, name: "ownerName" }) ?? "") as string}
        onChange={(value) => setValue("ownerName", value)}
        onSelect={(suggestion) => setValue("ownerId", suggestion.id)}
        fetchData={(search) => getOwners({ search })}
        placeholder="Введите имя владельца"
      />

      {/* Роль участника */}
      <div>
        <label htmlFor="role" className="block mb-1 font-medium">
          Роль участника
        </label>
        <select
          id="role"
          {...register("role", { required: "Это поле обязательно" })}
          className={`w-full p-2 border rounded`}
        >
          <option value="">Выберите роль</option>
          <option value="DRIVER">Водитель</option>
          <option value="PASSENGER">Пассажир</option>
          <option value="PEDESTRIAN">Пешеход</option>
        </select>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Добавить участника
      </button>
    </form>
  );
};

export default AddAccidentParticipantsForm;