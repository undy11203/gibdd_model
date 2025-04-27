'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addToWanted, getVehicleByLicensePlate } from '../../utils/api';

interface AddWantedVehicleFormData {
  licensePlate: string;
  reason: 'HIT_AND_RUN' | 'THEFT';
  description: string;
}

const AddWantedVehicleForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddWantedVehicleFormData>({
    defaultValues: {
      licensePlate: '',
      reason: 'HIT_AND_RUN',
      description: ''
    }
  });

  const onSubmit = async (data: AddWantedVehicleFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Проверяем существование транспортного средства
      const vehicleResponse = await getVehicleByLicensePlate(data.licensePlate);
      const vehicle = vehicleResponse.data;

      if (!vehicle) {
        setError('Транспортное средство с указанным номером не найдено');
        return;
      }

      // Добавляем в розыск
      await addToWanted({
        vehicle: {
          licensePlate: {
            licenseNumber: data.licensePlate
          },
          brand: vehicle.brand,
          color: vehicle.color
        },
        addedDate: new Date().toISOString(),
        reason: data.reason,
        status: 'WANTED',
        description: data.description
      });

      reset();
      onSuccess();
      alert('Транспортное средство успешно добавлено в розыск');
    } catch (err) {
      console.error(err);
      setError('Ошибка при добавлении в розыск');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Добавить в розыск</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Номерной знак</label>
          <input
            type="text"
            {...register('licensePlate', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
            placeholder="А123БВ777"
          />
          {errors.licensePlate && (
            <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Причина розыска</label>
          <select
            {...register('reason', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          >
            <option value="HIT_AND_RUN">Скрылся с места ДТП</option>
            <option value="THEFT">Угон</option>
          </select>
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Описание</label>
          <textarea
            {...register('description', { required: 'Обязательное поле' })}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Укажите дополнительные детали..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Добавление...' : 'Добавить в розыск'}
        </button>
      </div>
    </form>
  );
};

export default AddWantedVehicleForm;
