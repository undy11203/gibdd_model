import { useEffect, useState, useCallback } from 'react';
import { Permission } from '../types/auth';
import { getCurrentUserPermissions } from '../utils/api/auth';

interface UsePermissionsReturn {
  permissions: Permission[];
  loading: boolean;
  error: Error | null;
  hasPermission: (resource: string, action: string) => boolean;
  isSuperAdmin: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const userPermissions = await getCurrentUserPermissions();
        setPermissions(userPermissions);
        // Check if any of the user's roles is a superadmin role
        setIsSuperAdmin(userPermissions.some((p: Permission) => p.name === 'ROLE_SUPERADMIN'));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch permissions'));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (isSuperAdmin) return true;

      return permissions.some(
        permission =>
          permission.resource === resource && permission.action === action
      );
    },
    [permissions, isSuperAdmin]
  );

  return {
    permissions,
    loading,
    error,
    hasPermission,
    isSuperAdmin
  };
};
