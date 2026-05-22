export const rolesPermissionsWorkspaces = {
  users: {
    eyebrow: 'Admin Management',
    title: 'Admin Users',
    description: 'Provisioned admin users, access posture, and operational ownership.',
    tableTitle: 'Admin Registry',
    tableSubtitle: 'Internal users with platform access',
    metrics: [
      { label: 'Admin Users', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'OFFLINE', label: 'Offline' }] },
      { key: 'role', label: 'Role', options: [{ value: 'SUPER ADMIN', label: 'Super Admin' }, { value: 'AUDITOR', label: 'Auditor' }, { value: 'OPERATOR', label: 'Operator' }] },
    ],
    columns: [
      { key: 'name', label: 'Admin' },
      { key: 'role', label: 'Role', type: 'status' },
      { key: 'permissions', label: 'Permissions' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'lastActive', label: 'Last Active', type: 'mono' },
      { key: 'desk', label: 'Desk' },
    ],
    rows: [
      { id: 'ADM-DEMO', name: 'Demo Admin', role: 'SUPER ADMIN', permissions: 'ALL', status: 'ACTIVE', lastActive: 'Now', desk: 'Core' },
    ],
  },
  roles: {
    eyebrow: 'Admin Management',
    title: 'Roles',
    description: 'Role templates for desks, approvals, and least-privilege enforcement.',
    tableTitle: 'Role Registry',
    tableSubtitle: 'Reusable role definitions',
    metrics: [
      { label: 'Roles', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'scope', label: 'Scope', options: [{ value: 'GLOBAL', label: 'Global' }, { value: 'DESK', label: 'Desk' }] },
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'REVIEW', label: 'Review' }] },
    ],
    columns: [
      { key: 'role', label: 'Role' },
      { key: 'scope', label: 'Scope', type: 'status' },
      { key: 'members', label: 'Members' },
      { key: 'permissions', label: 'Permissions' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: [
      { id: 'ROLE-DEMO', role: 'Demo Role', scope: 'GLOBAL', members: '1', permissions: 'ALL', status: 'ACTIVE', updated: '2024-01-01' },
    ],
  },
  permissions: {
    eyebrow: 'Admin Management',
    title: 'Permissions',
    description: 'Permission matrix and privilege distribution across the admin platform.',
    tableTitle: 'Permission Matrix',
    tableSubtitle: 'Permission catalog',
    metrics: [
      { label: 'Permission Keys', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'module', label: 'Module', options: [{ value: 'FINANCE', label: 'Finance' }, { value: 'TRADING', label: 'Trading' }, { value: 'USERS', label: 'Users' }] },
      { key: 'sensitivity', label: 'Sensitivity', options: [{ value: 'LOW', label: 'Low' }, { value: 'HIGH', label: 'High' }] },
    ],
    columns: [
      { key: 'permission', label: 'Permission', type: 'mono' },
      { key: 'module', label: 'Module', type: 'status' },
      { key: 'description', label: 'Description' },
      { key: 'sensitivity', label: 'Sensitivity', type: 'status' },
      { key: 'roles', label: 'Roles' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: [
      { id: 'PERM-DEMO', permission: 'demo.access', module: 'SYSTEM', description: 'Demo permission', sensitivity: 'LOW', roles: 'Demo Role', updated: '2024-01-01' },
    ],
  },
};
