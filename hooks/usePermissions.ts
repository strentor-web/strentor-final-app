import { useAuth } from './useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/auth-utils';
import { PERMISSIONS } from '@/types/auth';

export function usePermissions() {
  const { user, hasAdminAccess, isFitnessTrainer } = useAuth();

  return {
    hasPermission: (permission: string) =>
      user ? hasPermission(user.role, permission) : false,

    hasAnyPermission: (permissions: string[]) =>
      user ? hasAnyPermission(user.role, permissions) : false,

    hasAllPermissions: (permissions: string[]) =>
      user ? hasAllPermissions(user.role, permissions) : false,

    // General permissions
    canManageClients: () =>
      user ? hasPermission(user.role, PERMISSIONS.CLIENTS_MANAGE) : false,

    canCreatePlans: () =>
      user ? hasPermission(user.role, PERMISSIONS.PLANS_CREATE) : false,

    canViewAdminPanel: () =>
      user ? hasPermission(user.role, PERMISSIONS.ADMIN_VIEW_ALL) : false,

    // Fitness trainer specific permissions
    canManageFitnessClients: () =>
      user ? hasPermission(user.role, PERMISSIONS.FITNESS_CLIENTS_MANAGE) : false,

    canCreateFitnessPlans: () =>
      user ? hasPermission(user.role, PERMISSIONS.FITNESS_PLANS_CREATE) : false,

    canViewFitnessProgress: () =>
      user ? hasPermission(user.role, PERMISSIONS.FITNESS_PROGRESS_VIEW) : false,

    // Role-based convenience methods
    isFitnessTrainer,
    hasAdminAccess,
  };
}
