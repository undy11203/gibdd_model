'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AccidentData, AccidentType, AccidentRole } from '@/types';
import { addAccident, getVehicleByLicensePlate } from '../../utils/api';

interface ParticipantData {
  licensePlate: string;
  role: AccidentRole;
}

interface AccidentFormData {
  date: string;
  latitude: string;
  longitude: string;
  type: AccidentType;
  description: string;
  victimsCount: string;
  damageAmount: string;
  cause: string;
  roadConditions: string;
  participants: ParticipantData[];
}

const accidentTypeLabels: Record<AccidentType, string> = {
  [AccidentType.COLLISION]: 'Столкновение',
  [AccidentType.OVERTURNING]: 'Опрокидывание',
  [AccidentType.HIT_AND_RUN]: 'Наезд и скрытие',
  [AccidentType.PEDESTRIAN_HIT]: 'Наезд на пешехода',
  [AccidentType.OTHER]: 'Прочие'
};

const accidentRoleLabels: Record<AccidentRole, string> = {
  [AccidentRole.CULPRIT]: 'Виновник',
  [AccidentRole.VICTIM]: 'Потерпевший',
  [AccidentRole.WITNESS]: 'Свидетель'
};

const AddAccidentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AccidentFormData>({
    defaultValues: {
      date: '',
      latitude: '',
      longitude: '',
      type: AccidentType.COLLISION,
      description: '',
      victimsCount: '',
      damageAmount: '',
      cause: '',
      roadConditions: '',
      participants: [{ licensePlate: '', role: AccidentRole.CULPRIT }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants'
  });

  const onSubmit = async (data: AccidentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate vehicle license plates
      for (const participant of data.participants) {
        try {
          await getVehicleByLicensePlate(participant.licensePlate);
        } catch (err) {
          setError(`Транспортное средство с номером ${participant.licensePlate} не найдено`);
          return;
        }
      }
      
      const preparedData: AccidentData = {
        date: data.date,
        location: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude)
        },
        type: data.type,
        description: data.description,
        victimsCount: parseInt(data.victimsCount),
        damageAmount: parseFloat(data.damageAmount),
        cause: data.cause,
        roadConditions: data.roadConditions,
        participants: data.participants
      };

      await addAccident(preparedData);
      alert('ДТП успешно зарегистрировано!');
      reset();
    } catch (error) {
      console.error(error);
      setError('Ошибка при регистрации ДТП');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Дата</label>
          <input
            type="date"
            {...register('date', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Тип ДТП</label>
          <select
            {...register('type', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          >
            {Object.entries(accidentTypeLabels).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Широта</label>
          <input
            type="number"
            step="any"
            {...register('latitude', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Долгота</label>
          <input
            type="number"
            step="any"
            {...register('longitude', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Описание</label>
          <textarea
            {...register('description', { required: 'Обязательное поле' })}
            rows={3}
            className="w-full p-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Количество пострадавших</label>
          <input
            type="number"
            {...register('victimsCount', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.victimsCount && (
            <p className="text-red-500 text-sm mt-1">{errors.victimsCount.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Сумма ущерба</label>
          <input
            type="number"
            step="0.01"
            {...register('damageAmount', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.damageAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.damageAmount.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Причина</label>
          <input
            type="text"
            {...register('cause', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.cause && (
            <p className="text-red-500 text-sm mt-1">{errors.cause.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Дорожные условия</label>
          <input
            type="text"
            {...register('roadConditions', { required: 'Обязательное поле' })}
            className="w-full p-2 border rounded"
          />
          {errors.roadConditions && (
            <p className="text-red-500 text-sm mt-1">{errors.roadConditions.message}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Участники ДТП</h3>
          <button
            type="button"
            onClick={() => append({ licensePlate: '', role: AccidentRole.VICTIM })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Добавить участника
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
            <div>
              <label className="block mb-1 font-medium">Номерной знак</label>
              <input
                type="text"
                {...register(`participants.${index}.licensePlate` as const, {
                  required: 'Обязательное поле'
                })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Роль</label>
              <select
                {...register(`participants.${index}.role` as const, {
                  required: 'Обязательное поле'
                })}
                className="w-full p-2 border rounded"
              >
                {Object.entries(accidentRoleLabels).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {index > 0 && (
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-center p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрировать ДТП'}
        </button>
      </div>
    </form>
  );
};

export default AddAccidentForm;
