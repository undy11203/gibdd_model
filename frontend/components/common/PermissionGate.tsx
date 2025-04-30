import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGateProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  children,
  fallback = null
}) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return null;
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
