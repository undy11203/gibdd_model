"use client";

import { useState, useEffect } from 'react';
import { Owner, OwnerData } from '@/types/owners';
import { getOwners, updateOwner, deleteOwner } from '@/utils/api/owners';
import { PageResponse } from '@/types/common';

const OwnersList = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for editing
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [editFormData, setEditFormData] = useState<OwnerData>({
    fullName: '',
    address: '',
    phone: '',
  });

  // Fetch owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const params: { search?: string; page: number; limit: number } = {
          page,
          limit: 10,
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        const response = await getOwners(params);
        setOwners(response.content);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching owners:', err);
        setError('Failed to load owners');
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, [page, searchTerm, refreshTrigger]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when search changes
  };

  // Start editing an owner
  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setEditFormData({
      fullName: owner.fullName,
      address: owner.address,
      phone: owner.phone,
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

  // Save edited owner
  const handleSaveEdit = async () => {
    if (!editingOwner) return;
    
    try {
      setLoading(true);
      
      await updateOwner(editingOwner.id, editFormData);
      
      // Update the local state
      setOwners(owners.map(owner => 
        owner.id === editingOwner.id 
          ? { 
              ...owner, 
              fullName: editFormData.fullName,
              address: editFormData.address,
              phone: editFormData.phone,
            } 
          : owner
      ));
      
      // Reset editing state
      setEditingOwner(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingOwner(null);
  };

  // Delete an owner
  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого владельца?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteOwner(id);
      
      // Refresh the list after deletion
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  if (loading && owners.length === 0) {
    return <div className="text-center p-4">Загрузка владельцев...</div>;
  }

  if (error && owners.length === 0) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Список владельцев</h2>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full max-w-md"
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
      
      {/* Owners list */}
      {owners.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">ФИО</th>
                <th className="py-2 px-4 border-b text-left">Адрес</th>
                <th className="py-2 px-4 border-b text-left">Телефон</th>
                <th className="py-2 px-4 border-b text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50">
                  {editingOwner?.id === owner.id ? (
                    // Edit mode
                    <>
                      <td className="py-2 px-4 border-b">{owner.id}</td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="fullName"
                          value={editFormData.fullName}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="address"
                          value={editFormData.address}
                          onChange={handleInputChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="phone"
                          value={editFormData.phone}
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
                      <td className="py-2 px-4 border-b">{owner.id}</td>
                      <td className="py-2 px-4 border-b">{owner.fullName}</td>
                      <td className="py-2 px-4 border-b">{owner.address}</td>
                      <td className="py-2 px-4 border-b">{owner.phone}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(owner)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(owner.id)}
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
          Владельцы не найдены.
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Страница {page + 1} из {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className={`px-3 py-1 rounded ${
                page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
              }`}
            >
              Назад
            </button>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              className={`px-3 py-1 rounded ${
                page >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
              }`}
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersList;
