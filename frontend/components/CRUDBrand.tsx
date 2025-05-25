import React, { useEffect, useState } from 'react';
import { Brand } from '@/types/brand';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '@/utils/api/brand';



const CRUDBrand: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await getBrands({ page: 0, limit: 100 });
      setBrands(response.content);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async () => {
    if (!newBrandName.trim()) return;
    try {
      const created = await createBrand({ name: newBrandName } as Brand);
      setBrands((prev) => [created, ...prev]);
      setNewBrandName('');
    } catch (error) {
      console.error('Failed to create brand', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingBrand) return;
    try {
      const updated = await updateBrand(editingBrand.id, editingBrand);
      setBrands((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setEditingBrand(null);
    } catch (error) {
      console.error('Failed to update brand', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete brand', error);
    }
  };

   return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="New brand name"
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          className="border border-gray-300 rounded-l-md p-2 flex-grow"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white rounded-r-md p-2 hover:bg-blue-600 transition"
        >
          Add Brand
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading brands...</p>
      ) : (
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
              {editingBrand?.id === brand.id ? (
                <>
                  <input
                    type="text"
                    value={editingBrand.name}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, name: e.target.value })
                    }
                    className="border border-gray-300 rounded-md p-2 flex-grow"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white rounded-md p-2 ml-2 hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBrand(null)}
                    className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-grow">{brand.name}</span>
                  <button
                    onClick={() => setEditingBrand(brand)}
                    className="bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CRUDBrand;
