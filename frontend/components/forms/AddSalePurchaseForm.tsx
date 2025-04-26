"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import SuggestionInput from '../input/SuggestionInput';
import { getVehicles, getOwners, addSalePurchase } from '@/utils/api';

interface SalePurchaseFormData {
  vehicleId: number | null;
  date: string;
  cost: number | null;
  buyerId: number | null;
  sellerId: number | null;
  sellerName: string;
  buyerName: string;
}

const AddSalePurchaseForm = () => {
  const { register, handleSubmit, setValue, control, reset } = useForm<SalePurchaseFormData>({
    defaultValues: {
      vehicleId: null,
      date: '',
      cost: null,
      buyerId: null,
      sellerId: null,
      sellerName: '',
    },
  });

  const sellerId = useWatch({ control, name: 'sellerId' });
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Обновление списка транспортных средств при изменении продавца
  useEffect(() => {
    if (sellerId) {
      getVehicles({ ownerId: sellerId })
        .then((response) => {
          const vehiclesData = response.data.content || response.data;
          setVehicles(vehiclesData);
        })
        .catch((error) => {
          console.error('Error fetching vehicles for seller', error);
          setVehicles([]);
        });
    } else {
      setVehicles([]);
      setValue('vehicleId', null);
    }
  }, [sellerId, setValue]);

  const onSuggestionSelect = (suggestion: { id: number; name: string }, field: 'seller' | 'buyer') => {
    if (field === 'seller') {
      setValue('sellerName', suggestion.name);
      setValue('sellerId', suggestion.id);
      setValue('vehicleId', null);
    } else if (field === 'buyer') {
      setValue('buyerName', suggestion.name);
      setValue('buyerId', suggestion.id);
    }
  };

  const onSubmit = async (data: SalePurchaseFormData) => {
    if (!data.vehicleId || !data.date || data.cost === null || !data.buyerId || !data.sellerId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await addSalePurchase({
        vehicleId: data.vehicleId,
        date: data.date + "T00:00:00",
        cost: data.cost,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
      });
      alert('Сделка купли-продажи успешно зарегистрирована!');

      reset({
        vehicleId: null,
        date: '',
        cost: null,
        buyerId: null,
        sellerId: null,
        sellerName: '',
      });
      setVehicles([]);
    } catch (error) {
      console.error('Error adding sale purchase', error);
      alert('Ошибка при регистрации сделки.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Поле для продавца */}
      <SuggestionInput
        value={(useWatch({ control, name: 'sellerName' }) ?? "") as string}
        onChange={(value) => setValue('sellerName', value)}
        onSelect={(suggestion) => onSuggestionSelect(suggestion, 'seller')}
        fetchData={(search) => getOwners({ search })}
        placeholder="Введите имя продавца"
      />

      {/* Выбор транспортного средства */}
      <select
        {...register('vehicleId', { valueAsNumber: true })}
        className="border p-2 w-full max-w-full"
        disabled={!sellerId}
      >
        <option value="">Выберите транспортное средство</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.brand?.name ?? 'Unknown Brand'} - {vehicle.licensePlate?.licenseNumber ?? 'Unknown License Plate'}
          </option>
        ))}
      </select>

      {/* Дата и стоимость */}
      <input type="date" {...register('date')} className="border p-2 w-full max-w-full" />
      <input
        type="number"
        placeholder="Стоимость"
        {...register('cost', { valueAsNumber: true })}
        className="border p-2 w-full max-w-full"
        min="0"
        step="0.01"
      />

      {/* Поле для покупателя */}
      <SuggestionInput
        value={(useWatch({ control, name: 'buyerName' }) ?? "") as string}
        onChange={(value) => setValue('buyerName', value)}
        onSelect={(suggestion) => onSuggestionSelect(suggestion, 'buyer')}
        fetchData={(search) => getOwners({ search })}
        placeholder="Введите имя покупателя"
      />

      {/* Кнопка отправки */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Зарегистрировать сделку
      </button>
    </form>
  );
};

export default AddSalePurchaseForm;