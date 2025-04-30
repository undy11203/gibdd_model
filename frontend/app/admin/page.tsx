import dynamic from 'next/dynamic';
import React from 'react';
import { PermissionGate } from '../../components/common/PermissionGate';

// Dynamically import components with SSR disabled to avoid hydration issues
const SqlQueryExecutor = dynamic(
  () => import('../../components/admin/SqlQueryExecutor'),
  { ssr: false }
);

const RoleManagement = dynamic(
  () => import('../../components/admin/RoleManagement').then(mod => ({ default: mod.RoleManagement })),
  { ssr: false }
);

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="space-y-8">
        {/* SQL Query Executor - protected by sql_execute permission */}
        <PermissionGate 
          resource="sql" 
          action="execute"
          fallback={<div>You don't have permission to execute SQL queries.</div>}
        >
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">SQL Query Executor</h2>
            <SqlQueryExecutor />
          </div>
        </PermissionGate>

        {/* Role Management - protected by role_manage permission */}
        <PermissionGate 
          resource="roles" 
          action="manage"
          fallback={<div>You don't have permission to manage roles.</div>}
        >
          <div className="bg-white shadow rounded-lg p-6">
            <RoleManagement />
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
