import React, { useEffect, useState } from 'react';
import { AlarmSystem } from '@/types/alarm-systems';
import {
  getAlarmSystems,
  createAlarmSystem,
  updateAlarmSystem,
  deleteAlarmSystem,
} from '@/utils/api/alarm-systems';

const CRUDAlarmSystem: React.FC = () => {
  const [alarmSystems, setAlarmSystems] = useState<AlarmSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAlarmSystem, setEditingAlarmSystem] = useState<AlarmSystem | null>(null);
  const [newAlarmSystemName, setNewAlarmSystemName] = useState('');

  const fetchAlarmSystems = async () => {
    setLoading(true);
    try {
      const response = await getAlarmSystems({ page: 0, limit: 100 });
      setAlarmSystems(response.content);
    } catch (error) {
      console.error('Failed to fetch alarm systems', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarmSystems();
  }, []);

  const handleCreate = async () => {
    if (!newAlarmSystemName.trim()) return;
    try {
      const created = await createAlarmSystem({ name: newAlarmSystemName } as AlarmSystem);
      setAlarmSystems((prev) => [created, ...prev]);
      setNewAlarmSystemName('');
    } catch (error) {
      console.error('Failed to create alarm system', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingAlarmSystem) return;
    try {
      const updated = await updateAlarmSystem(editingAlarmSystem.id, editingAlarmSystem);
      setAlarmSystems((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setEditingAlarmSystem(null);
    } catch (error) {
      console.error('Failed to update alarm system', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAlarmSystem(id);
      setAlarmSystems((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete alarm system', error);
    }
  };

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Alarm Systems</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="New alarm system name"
          value={newAlarmSystemName}
          onChange={(e) => setNewAlarmSystemName(e.target.value)}
          className="border border-gray-300 rounded-l-md p-2 flex-grow"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white rounded-r-md p-2 hover:bg-blue-600 transition"
        >
          Add Alarm System
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading alarm systems...</p>
      ) : (
        <ul className="space-y-2">
          {alarmSystems.map((alarmSystem) => (
            <li key={alarmSystem.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
              {editingAlarmSystem?.id === alarmSystem.id ? (
                <>
                  <input
                    type="text"
                    value={editingAlarmSystem.name}
                    onChange={(e) =>
                      setEditingAlarmSystem({ ...editingAlarmSystem, name: e.target.value })
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
                    onClick={() => setEditingAlarmSystem(null)}
                    className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </>
              )  :(
                <>
                  <span className="flex-grow">{alarmSystem.name}</span>
                  <button
                    onClick={() => setEditingAlarmSystem(alarmSystem)}
                    className="bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(alarmSystem.id)}
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

export default CRUDAlarmSystem;
