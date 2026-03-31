import { hasPermission } from '../app/config/permissions';
import { useAdminSession } from '../app/providers/AdminSessionProvider';

export function usePermissionGate(permission) {
  const { permissions } = useAdminSession();
  return hasPermission(permissions, permission);
}
