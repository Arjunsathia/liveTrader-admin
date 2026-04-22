export const auditLogsWorkspaces = {
  'access-logs': {
    eyebrow: 'Admin Management',
    title: 'Access Logs',
    description: 'Authentication events, device fingerprints, and access anomalies.',
    tableTitle: 'Access Logs',
    tableSubtitle: 'Admin sign-in and session audit',
    metrics: [
      { label: 'Logins Today', value: '18', subtext: 'Successful authentications', trend: 'up' },
      { label: 'Failed Attempts', value: '2', subtext: 'Blocked by policy', trend: 'warning' },
      { label: 'New Devices', value: '1', subtext: 'Requires review', trend: 'warning' },
      { label: 'Suspicious', value: '0', subtext: 'No unusual access', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'SUCCESS', label: 'Success' }, { value: 'FAILED', label: 'Failed' }, { value: 'NEW_DEVICE', label: 'New Device' }] },
      { key: 'location', label: 'Location', options: [{ value: 'US', label: 'US' }, { value: 'UK', label: 'UK' }, { value: 'IN', label: 'IN' }] },
    ],
    columns: [
      { key: 'event', label: 'Event', type: 'mono' },
      { key: 'admin', label: 'Admin' },
      { key: 'location', label: 'Location' },
      { key: 'device', label: 'Device' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'time', label: 'Time', type: 'mono' },
    ],
    rows: [
      { id: 'ALOG-1', event: 'AUTH-331', admin: 'Alex Rivera', location: 'US', device: 'Chrome / Mac', status: 'SUCCESS', time: '09:12' },
      { id: 'ALOG-2', event: 'AUTH-332', admin: 'System Auditor', location: 'UK', device: 'Edge / Windows', status: 'NEW_DEVICE', time: '08:58' },
      { id: 'ALOG-3', event: 'AUTH-333', admin: 'Support Lead', location: 'IN', device: 'Chrome / Windows', status: 'FAILED', time: '08:30' },
    ],
  },
  'activity-logs': {
    eyebrow: 'Admin Management',
    title: 'Activity Logs',
    description: 'Tracked admin actions across user, finance, trading, and settings workflows.',
    tableTitle: 'Activity Logs',
    tableSubtitle: 'Operator action audit trail',
    metrics: [
      { label: 'Actions Today', value: '214', subtext: 'Tracked admin actions', trend: 'up' },
      { label: 'Sensitive Actions', value: '12', subtext: 'Dual control recommended', trend: 'warning' },
      { label: 'Reverted', value: '1', subtext: 'Manual rollback', trend: 'warning' },
      { label: 'Audit Freshness', value: 'Real-time', subtext: 'Streaming logs healthy', trend: 'up' },
    ],
    filters: [
      { key: 'module', label: 'Module', options: [{ value: 'USERS', label: 'Users' }, { value: 'FINANCE', label: 'Finance' }, { value: 'SETTINGS', label: 'Settings' }] },
      { key: 'severity', label: 'Severity', options: [{ value: 'INFO', label: 'Info' }, { value: 'REVIEW', label: 'Review' }, { value: 'HIGH', label: 'High' }] },
    ],
    columns: [
      { key: 'action', label: 'Action', type: 'mono' },
      { key: 'admin', label: 'Admin' },
      { key: 'module', label: 'Module', type: 'status' },
      { key: 'description', label: 'Description' },
      { key: 'severity', label: 'Severity', type: 'status' },
      { key: 'time', label: 'Time', type: 'mono' },
    ],
    rows: [
      { id: 'ACT-1', action: 'AUD-241', admin: 'Alex Rivera', module: 'FINANCE', description: 'Approved high-value withdrawal', severity: 'HIGH', time: '09:18' },
      { id: 'ACT-2', action: 'AUD-242', admin: 'System Auditor', module: 'USERS', description: 'Exported KYC audit pack', severity: 'REVIEW', time: '08:44' },
      { id: 'ACT-3', action: 'AUD-243', admin: 'Support Lead', module: 'SETTINGS', description: 'Updated support notification routing', severity: 'INFO', time: '08:20' },
    ],
  },
};
