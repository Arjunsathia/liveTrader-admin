export const PERMISSIONS = {
  dashboard: {
    view: 'dashboard.view',
  },
  users: {
    view: 'users.view',
    create: 'users.create',
    edit: 'users.edit',
    kyc: 'users.kyc',
    mt5: 'users.mt5',
    risk: 'users.risk',
  },
  finance: {
    view: 'finance.view',
    approve: 'finance.approve',
    export: 'finance.export',
  },
  trading: {
    view: 'trading.view',
    intervene: 'trading.intervene',
  },
  copyTrading: {
    view: 'copy-trading.view',
    manage: 'copy-trading.manage',
  },
  propTrading: {
    view: 'prop-trading.view',
    manage: 'prop-trading.manage',
    approve: 'prop-trading.approve',
  },
  ibSystem: {
    view: 'ib-system.view',
    payouts: 'ib-system.payouts',
  },
  reports: {
    view: 'reports.view',
    export: 'reports.export',
  },
  support: {
    view: 'support.view',
    escalate: 'support.escalate',
  },
  settings: {
    view: 'settings.view',
    edit: 'settings.edit',
  },
  adminMgmt: {
    view: 'admin-mgmt.view',
    manage: 'admin-mgmt.manage',
  },
};

export const ROLE_PRESETS = {
  'super-admin': ['*'],
  operations: [
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
    PERMISSIONS.users.create,
    PERMISSIONS.users.edit,
    PERMISSIONS.users.kyc,
    PERMISSIONS.users.mt5,
    PERMISSIONS.finance.view,
    PERMISSIONS.finance.approve,
    PERMISSIONS.trading.view,
    PERMISSIONS.trading.intervene,
    PERMISSIONS.copyTrading.view,
    PERMISSIONS.copyTrading.manage,
    PERMISSIONS.propTrading.view,
    PERMISSIONS.propTrading.manage,
    PERMISSIONS.propTrading.approve,
    PERMISSIONS.ibSystem.view,
    PERMISSIONS.reports.view,
    PERMISSIONS.support.view,
    PERMISSIONS.support.escalate,
  ],
  auditor: [
    PERMISSIONS.dashboard.view,
    PERMISSIONS.users.view,
    PERMISSIONS.finance.view,
    PERMISSIONS.trading.view,
    PERMISSIONS.copyTrading.view,
    PERMISSIONS.propTrading.view,
    PERMISSIONS.ibSystem.view,
    PERMISSIONS.reports.view,
    PERMISSIONS.support.view,
    PERMISSIONS.adminMgmt.view,
  ],
};

export function hasPermission(grantedPermissions = [], requiredPermission) {
  if (!requiredPermission) return true;

  if (grantedPermissions.includes('*')) {
    return true;
  }

  if (Array.isArray(requiredPermission)) {
    return requiredPermission.every((permission) => grantedPermissions.includes(permission));
  }

  return grantedPermissions.includes(requiredPermission);
}
