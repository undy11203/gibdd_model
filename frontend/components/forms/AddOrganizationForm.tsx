"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addOrganization } from "@/utils/api";

interface OrganizationFormData {
  name: string;
  district: string;
  address: string;
  director: string;
}

export default function AddOrganizationForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrganizationFormData>();
  const router = useRouter();

  // Обработчик отправки формы
  const onSubmit = async (data: OrganizationFormData) => {
    try {
      await addOrganization(data);
      reset(); // Очищаем форму после успешной отправки
      router.push("/organizations");
    } catch (error) {
      console.error("Ошибка при добавлении организации:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Поле "Название организации" */}
      <div>
        <input
          type="text"
          id="name"
          placeholder="Название организации"
          {...register("name", { required: "Это поле обязательно" })}
          className={`mt-1 block w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Поле "Район" */}
      <div>
        <input
          type="text"
          id="district"
          placeholder="Район"
          {...register("district", { required: "Это поле обязательно" })}
          className={`mt-1 block w-full border ${
            errors.district ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2`}
        />
        {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
      </div>

      {/* Поле "Адрес" */}
      <div>
        <input
          type="text"
          id="address"
          placeholder="Адрес"
          {...register("address", { required: "Это поле обязательно" })}
          className={`mt-1 block w-full border ${
            errors.address ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2`}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      {/* Поле "Директор" */}
      <div>
        <input
          type="text"
          id="director"
          placeholder="Директор"
          {...register("director", { required: "Это поле обязательно" })}
          className={`mt-1 block w-full border ${
            errors.director ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2`}
        />
        {errors.director && <p className="text-red-500 text-sm">{errors.director.message}</p>}
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Добавить организацию
      </button>
    </form>
  );
}