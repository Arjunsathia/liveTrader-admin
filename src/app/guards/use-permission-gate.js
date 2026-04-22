import { hasPermission } from '@config/permissions/permissions';
import { useAdminSession } from '../providers/AdminSessionProvider';

export function usePermissionGate(permission) {
  const { permissions } = useAdminSession();
  return hasPermission(permissions, permission);
}
