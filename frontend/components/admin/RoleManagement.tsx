import React, { useEffect, useState } from 'react';
import {
  getAllRoles,
  getAllPermissions,
  createRole,
  updateRole,
  createPermission
} from '@/utils/api/';
import {
  Role,
  Permission,
  CreateRoleRequest,
  CreatePermissionRequest,
  UpdateRoleRequest
} from '../../types/auth';

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [newPermissionName, setNewPermissionName] = useState('');
  const [newPermissionResource, setNewPermissionResource] = useState('');
  const [newPermissionAction, setNewPermissionAction] = useState('');
  const [newPermissionDescription, setNewPermissionDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getAllRoles(),
        getAllPermissions()
      ]);
      setRoles(rolesResponse);
      setPermissions(permissionsResponse);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleData: CreateRoleRequest = {
        name: newRoleName,
        description: newRoleDescription,
        permissionIds: selectedPermissions,
        isSuperAdmin: false
      };
      await createRole(roleData);
      await fetchData();
      // Reset form
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
    } catch (err) {
      setError('Failed to create role');
      console.error(err);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      const roleData: UpdateRoleRequest = {
        name: selectedRole.name,
        description: selectedRole.description,
        permissionIds: selectedPermissions
      };
      await updateRole(selectedRole.id, roleData);
      await fetchData();
      setSelectedRole(null);
    } catch (err) {
      setError('Failed to update role');
      console.error(err);
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const permissionData: CreatePermissionRequest = {
        name: newPermissionName,
        resource: newPermissionResource,
        action: newPermissionAction,
        description: newPermissionDescription
      };
      await createPermission(permissionData);
      await fetchData();
      // Reset form
      setNewPermissionName('');
      setNewPermissionResource('');
      setNewPermissionAction('');
      setNewPermissionDescription('');
    } catch (err) {
      setError('Failed to create permission');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>

      {/* Create Role Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Role</h2>
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Description:</label>
            <input
              type="text"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Permissions:</label>
            <div className="space-y-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, permission.id]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter((id) => id !== permission.id)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  {permission.name} ({permission.resource} - {permission.action})
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Role
          </button>
        </form>
      </div>

      {/* Create Permission Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Permission</h2>
        <form onSubmit={handleCreatePermission} className="space-y-4">
          <div>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={newPermissionName}
              onChange={(e) => setNewPermissionName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Resource:</label>
            <input
              type="text"
              value={newPermissionResource}
              onChange={(e) => setNewPermissionResource(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Action:</label>
            <input
              type="text"
              value={newPermissionAction}
              onChange={(e) => setNewPermissionAction(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Description:</label>
            <input
              type="text"
              value={newPermissionDescription}
              onChange={(e) => setNewPermissionDescription(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Permission
          </button>
        </form>
      </div>

      {/* Existing Roles List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Roles</h2>
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="border p-4 rounded">
              <h3 className="font-semibold">{role.name}</h3>
              <p className="text-gray-600">{role.description}</p>
              <div className="mt-2">
                <strong>Permissions:</strong>
                <ul className="list-disc list-inside">
                  {role.permissions.map((permission) => (
                    <li key={permission.id}>
                      {permission.name} ({permission.resource} - {permission.action})
                    </li>
                  ))}
                </ul>
              </div>
              {!role.isSuperAdmin && (
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setSelectedPermissions(role.permissions.map((p) => p.id));
                  }}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Role: {selectedRole.name}</h2>
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block mb-2">Permissions:</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, permission.id]);
                          } else {
                            setSelectedPermissions(
                              selectedPermissions.filter((id) => id !== permission.id)
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      {permission.name} ({permission.resource} - {permission.action})
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
