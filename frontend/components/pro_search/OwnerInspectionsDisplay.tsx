"use client";

import { useState, useEffect } from "react";
import { getOwners, getVehicles } from "@/utils/api";
import { getInspections, updateInspection, deleteInspection } from "@/utils/api/inspections";
import { Owner } from "@/types/owners";
import { TechnicalInspection, InspectionData } from "@/types/inspections";
import SuggestionInput from "../input/SuggestionInput";

const OwnerInspectionsDisplay = () => {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [ownerName, setOwnerName] = useState<string>("");
  const [inspections, setInspections] = useState<TechnicalInspection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for editing
  const [editingInspection, setEditingInspection] = useState<TechnicalInspection | null>(null);
  const [editFormData, setEditFormData] = useState<{
    inspectionDate: string;
    result: string;
    nextInspectionDate: string;
  }>({
    inspectionDate: "",
    result: "",
    nextInspectionDate: "",
  });

  // Handle owner selection
  const handleOwnerSelect = async (suggestion: { id: number; name: string }) => {
    setOwnerName(suggestion.name);
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the owner details
      const owner = await getOwners({ search: suggestion.name });
      const ownerData = owner.content.find(o => o.id === suggestion.id);
      
      if (ownerData) {
        setSelectedOwner(ownerData);
        
        // Fetch vehicles for this owner
        const vehiclesResponse = await getVehicles({ ownerId: ownerData.id });
        const vehicles = vehiclesResponse.content;
        
        // Fetch inspections for each vehicle
        let allInspections: TechnicalInspection[] = [];
        
        for (const vehicle of vehicles) {
          const inspectionsResponse = await getInspections();
          // Filter inspections for the current vehicle
          const vehicleInspections = inspectionsResponse.content.filter(
            inspection => inspection.vehicle.id === vehicle.id
          );
          allInspections = [...allInspections, ...vehicleInspections];
        }
        
        setInspections(allInspections);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Start editing an inspection
  const handleEdit = (inspection: TechnicalInspection) => {
    setEditingInspection(inspection);
    setEditFormData({
      inspectionDate: inspection.inspectionDate,
      result: inspection.result,
      nextInspectionDate: inspection.nextInspectionDate,
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Save edited inspection
  const handleSaveEdit = async () => {
    if (!editingInspection) return;
    
    try {
      setLoading(true);
      
      const updatedData: InspectionData = {
        vehicleId: editingInspection.vehicle.id,
        inspectionDate: editFormData.inspectionDate,
        result: editFormData.result,
        nextInspectionDate: editFormData.nextInspectionDate,
      };
      
      await updateInspection(editingInspection.id, updatedData);
      
      // Update the local state
      setInspections(inspections.map(inspection => 
        inspection.id === editingInspection.id 
          ? { 
              ...inspection, 
              inspectionDate: editFormData.inspectionDate,
              result: editFormData.result,
              nextInspectionDate: editFormData.nextInspectionDate
            } 
          : inspection
      ));
      
      // Reset editing state
      setEditingInspection(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingInspection(null);
  };

  // Delete an inspection
  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись о техосмотре?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteInspection(id);
      
      // Update the local state
      setInspections(inspections.filter(inspection => inspection.id !== id));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Технические осмотры по владельцу</h2>
      
      {/* Owner selection */}
      <div className="mb-6">
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
          Выберите владельца
        </label>
        <SuggestionInput
          placeholder="Поиск владельца"
          value={ownerName}
          onChange={(value) => setOwnerName(value)}
          onSelect={(suggestion) => handleOwnerSelect(suggestion)}
          fetchData={(search) => getOwners({ search })}
        />
      </div>
      
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
      
      {/* Selected owner info */}
      {selectedOwner && !loading && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold">Выбранный владелец:</h3>
          <p>{selectedOwner.fullName}</p>
          <p>Адрес: {selectedOwner.address}</p>
          <p>Телефон: {selectedOwner.phone}</p>
        </div>
      )}
      
      {/* Inspections list */}
      {!loading && inspections.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Транспортное средство</th>
                <th className="py-2 px-4 border-b text-left">Гос. номер</th>
                <th className="py-2 px-4 border-b text-left">Дата ТО</th>
                <th className="py-2 px-4 border-b text-left">Результат</th>
                <th className="py-2 px-4 border-b text-left">Следующий ТО</th>
                <th className="py-2 px-4 border-b text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50">
                  {editingInspection?.id === inspection.id ? (
                    // Edit mode
                    <>
                      <td className="py-2 px-4 border-b">
                        {`${inspection.vehicle.brand?.name || "Неизвестно"}`}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {inspection.vehicle.licensePlate?.licenseNumber || "Нет номера"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="date"
                          name="inspectionDate"
                          value={editFormData.inspectionDate}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="result"
                          value={editFormData.result}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="date"
                          name="nextInspectionDate"
                          value={editFormData.nextInspectionDate}
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
                      <td className="py-2 px-4 border-b">
                        {`${inspection.vehicle.brand?.name || "Неизвестно"}`}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {inspection.vehicle.licensePlate?.licenseNumber || "Нет номера"}
                      </td>
                      <td className="py-2 px-4 border-b">{formatDate(inspection.inspectionDate)}</td>
                      <td className="py-2 px-4 border-b">{inspection.result}</td>
                      <td className="py-2 px-4 border-b">{formatDate(inspection.nextInspectionDate)}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(inspection)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(inspection.id)}
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
      )}
      
      {/* No inspections message */}
      {!loading && selectedOwner && inspections.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
          У данного владельца нет зарегистрированных технических осмотров.
        </div>
      )}
      
      {/* No owner selected message */}
      {!loading && !selectedOwner && (
        <div className="p-4 bg-gray-50 border border-gray-200 text-gray-600 rounded">
          Выберите владельца для просмотра технических осмотров.
        </div>
      )}
    </div>
  );
};

export default OwnerInspectionsDisplay;
