'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { useForm, useFieldArray } from 'react-hook-form';
import { AccidentData } from '@/types'; // Removed AccidentType, AccidentRole
import { addAccident, getVehicleByLicensePlate, getAccidentTypes, getAccidentRoles } from '../../utils/api'; // Added getAccidentTypes, getAccidentRoles
import YandexLocationPicker from '../../components/YandexLocationPicker';

interface ParticipantData {
  licensePlate: string;
  role: string; // Was AccidentRole
}

interface AccidentFormData {
  date: string;
  latitude: string;
  longitude: string;
  type: string; // Was AccidentType
  description: string;
  victimsCount: string;
  damageAmount: string;
  cause: string;
  roadConditions: string;
  participants: ParticipantData[];
}

// accidentTypeLabels and accidentRoleLabels are removed as options are now dynamically populated.

const AddAccidentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accidentTypeOptions, setAccidentTypeOptions] = useState<string[]>([]); // Added
  const [accidentRoleOptions, setAccidentRoleOptions] = useState<string[]>([]); // Added

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<AccidentFormData>({
    defaultValues: {
      date: '',
      latitude: '',
      longitude: '',
      type: '', // Was AccidentType.COLLISION, now string
      description: '',
      victimsCount: '',
      damageAmount: '',
      cause: '',
      roadConditions: '',
      participants: [{ licensePlate: '', role: '' }] // Was AccidentRole.CULPRIT, now string
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants'
  });

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const types = await getAccidentTypes();
        setAccidentTypeOptions(types);
        const roles = await getAccidentRoles();
        setAccidentRoleOptions(roles);
      } catch (err) {
        console.error("Error fetching accident enums", err);
      }
    };
    fetchEnums();
  }, []);

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
      setLatitude(null);
      setLongitude(null);
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
            <option value="">Выберите тип ДТП</option>
            {accidentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Местоположение ДТП</label>
          <YandexLocationPicker
            apiKey="cd63fdfd-c1f8-41f8-b1a5-c3f9556352de" // Пример API ключа, в реальном приложении следует использовать переменные окружения
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
              setValue('latitude', lat.toString());
              setValue('longitude', lng.toString());
            }}
          />
          {(errors.latitude || errors.longitude) && (
            <p className="text-red-500 text-sm mt-1">Необходимо указать местоположение</p>
          )}
          <input type="hidden" {...register('latitude', { required: 'Обязательное поле' })} />
          <input type="hidden" {...register('longitude', { required: 'Обязательное поле' })} />
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
            onClick={() => append({ licensePlate: '', role: '' })} // Default role to empty string
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
                <option value="">Выберите роль</option>
                {accidentRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
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
