"use client";

import { useState, useEffect } from 'react';
import { SalePurchase, SalePurchaseData, getSalePurchases, deleteSalePurchase, updateSalePurchase } from '../../utils/api/sales-purchases';
import { getOwners } from '@/utils/api/owners';
import { getVehicles } from '@/utils/api/vehicles';
import SuggestionInput from '../input/SuggestionInput';

const SalePurchasesList = () => {
  const [salePurchases, setSalePurchases] = useState<SalePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for editing
  const [editingSalePurchase, setEditingSalePurchase] = useState<SalePurchase | null>(null);
  const [editFormData, setEditFormData] = useState<{
    date: string;
    cost: number;
    buyerId: number;
    sellerId: number;
    vehicleId: number;
    buyerName: string;
    sellerName: string;
  }>({
    date: '',
    cost: 0,
    buyerId: 0,
    sellerId: 0,
    vehicleId: 0,
    buyerName: '',
    sellerName: '',
  });

  useEffect(() => {
    const fetchSalePurchases = async () => {
      try {
        setLoading(true);
        const response = await getSalePurchases();
        setSalePurchases(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sale/purchase records:', err);
        setError('Failed to load sale/purchase records');
      } finally {
        setLoading(false);
      }
    };

    fetchSalePurchases();
  }, [refreshTrigger]);

  // Start editing a sale/purchase record
  const handleEdit = (salePurchase: SalePurchase) => {
    setEditingSalePurchase(salePurchase);
    setEditFormData({
      date: salePurchase.date,
      cost: salePurchase.cost,
      buyerId: salePurchase.buyer.id,
      sellerId: salePurchase.seller.id,
      vehicleId: salePurchase.vehicle.id,
      buyerName: salePurchase.buyer.fullName,
      sellerName: salePurchase.seller.fullName,
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'cost' ? parseFloat(value) : value,
    });
  };

  // Handle buyer selection
  const handleBuyerSelect = (suggestion: { id: number; name: string }) => {
    setEditFormData({
      ...editFormData,
      buyerId: suggestion.id,
      buyerName: suggestion.name,
    });
  };

  // Handle seller selection
  const handleSellerSelect = (suggestion: { id: number; name: string }) => {
    setEditFormData({
      ...editFormData,
      sellerId: suggestion.id,
      sellerName: suggestion.name,
    });
  };

  // Save edited sale/purchase record
  const handleSaveEdit = async () => {
    if (!editingSalePurchase) return;
    
    try {
      setLoading(true);
      
      const updateData: SalePurchaseData = {
        vehicleId: editFormData.vehicleId,
        date: editFormData.date,
        cost: editFormData.cost,
        buyerId: editFormData.buyerId,
        sellerId: editFormData.sellerId,
      };
      
      await updateSalePurchase(editingSalePurchase.id, updateData);
      
      // Refresh the list after update
      setRefreshTrigger(prev => prev + 1);
      
      // Reset editing state
      setEditingSalePurchase(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSalePurchase(null);
  };

  // Delete a sale/purchase record
  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись о продаже/покупке?')) {
      try {
        setLoading(true);
        await deleteSalePurchase(id);
        
        // Refresh the list after deletion
        setRefreshTrigger(prev => prev + 1);
        
      } catch (err) {
        console.error('Error deleting sale/purchase record:', err);
        setError('Failed to delete sale/purchase record');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && salePurchases.length === 0) {
    return <div className="text-center p-4">Загрузка записей о продажах/покупках...</div>;
  }

  if (error && salePurchases.length === 0) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Записи о продажах/покупках</h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Sale/Purchase records list */}
      {salePurchases.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Дата</th>
                <th className="py-2 px-4 border-b text-left">Транспортное средство</th>
                <th className="py-2 px-4 border-b text-left">Гос. номер</th>
                <th className="py-2 px-4 border-b text-left">Продавец</th>
                <th className="py-2 px-4 border-b text-left">Покупатель</th>
                <th className="py-2 px-4 border-b text-left">Стоимость</th>
                <th className="py-2 px-4 border-b text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {salePurchases.map((salePurchase) => (
                <tr key={salePurchase.id} className="hover:bg-gray-50">
                  {editingSalePurchase?.id === salePurchase.id ? (
                    // Edit mode
                    <>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="date"
                          name="date"
                          value={editFormData.date}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        {salePurchase.vehicle?.model || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {salePurchase.vehicle?.licensePlate?.licenseNumber || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <SuggestionInput
                          placeholder="Поиск продавца"
                          value={editFormData.sellerName}
                          onChange={(value) => setEditFormData({...editFormData, sellerName: value})}
                          onSelect={handleSellerSelect}
                          fetchData={(search) => getOwners({ search })}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <SuggestionInput
                          placeholder="Поиск покупателя"
                          value={editFormData.buyerName}
                          onChange={(value) => setEditFormData({...editFormData, buyerName: value})}
                          onSelect={handleBuyerSelect}
                          fetchData={(search) => getOwners({ search })}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          name="cost"
                          value={editFormData.cost}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Отмена
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="py-2 px-4 border-b">{new Date(salePurchase.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{salePurchase.vehicle?.model || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{salePurchase.vehicle?.licensePlate?.licenseNumber || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{salePurchase.seller?.fullName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{salePurchase.buyer?.fullName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{salePurchase.cost.toLocaleString()} ₽</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(salePurchase)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(salePurchase.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
          Записи о продажах/покупках не найдены.
        </div>
      )}
    </div>
  );
};

export default SalePurchasesList;
