"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Администрирование</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2">
            <strong>{user.name}</strong> - Роль: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}