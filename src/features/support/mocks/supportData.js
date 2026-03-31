export const supportWorkspaces = {
  tickets: {
    eyebrow: 'Support',
    title: 'Tickets',
    description: 'Primary support queue for live customer issues and internal workflows.',
    tableTitle: 'Ticket Queue',
    tableSubtitle: 'Open and active support tickets',
    metrics: [
      { label: 'Open Tickets', value: '42', subtext: 'Awaiting response', trend: 'warning' },
      { label: 'Avg Response', value: '1.5h', subtext: 'Last 24 hours', trend: 'up' },
      { label: 'Urgent', value: '3', subtext: 'Priority management review', trend: 'danger' },
      { label: 'CSAT', value: '4.8/5', subtext: 'Service satisfaction', trend: 'up' },
    ],
    filters: [
      { key: 'priority', label: 'Priority', options: [{ value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }] },
      { key: 'status', label: 'Status', options: [{ value: 'OPEN', label: 'Open' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'RESOLVED', label: 'Resolved' }] },
    ],
    columns: [
      { key: 'ticket', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: [
      { id: 'SUP-1', ticket: 'TKT-1025', user: 'Marco Rossi', subject: 'Withdrawal Delay', priority: 'HIGH', status: 'OPEN', updated: '12m ago' },
      { id: 'SUP-2', ticket: 'TKT-1024', user: 'Elena Vance', subject: '2FA Reset Request', priority: 'MEDIUM', status: 'IN_PROGRESS', updated: '2h ago' },
      { id: 'SUP-3', ticket: 'TKT-1023', user: 'Kofi Arhin', subject: 'API Key Error', priority: 'LOW', status: 'RESOLVED', updated: '5h ago' },
    ],
  },
  escalated: {
    eyebrow: 'Support',
    title: 'Escalated Tickets',
    description: 'Tickets escalated to management, finance, compliance, or trading operations.',
    tableTitle: 'Escalated Queue',
    tableSubtitle: 'High-touch escalations',
    metrics: [
      { label: 'Escalated', value: '11', subtext: 'Currently active', trend: 'danger' },
      { label: 'Compliance', value: '4', subtext: 'KYC or AML related', trend: 'warning' },
      { label: 'Finance', value: '3', subtext: 'Payout or funding issues', trend: 'warning' },
      { label: 'Trading', value: '2', subtext: 'Execution or MT5 issues', trend: 'warning' },
    ],
    filters: [
      { key: 'owner', label: 'Owner', options: [{ value: 'COMPLIANCE', label: 'Compliance' }, { value: 'FINANCE', label: 'Finance' }, { value: 'TRADING', label: 'Trading' }] },
      { key: 'status', label: 'Status', options: [{ value: 'ESCALATED', label: 'Escalated' }, { value: 'IN_REVIEW', label: 'In Review' }, { value: 'RESOLVED', label: 'Resolved' }] },
    ],
    columns: [
      { key: 'ticket', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'owner', label: 'Owner', type: 'status' },
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: [
      { id: 'SUP-E-1', ticket: 'TKT-2001', user: 'Elena Vance', owner: 'COMPLIANCE', subject: 'POA refresh blocking withdrawal', status: 'ESCALATED', updated: '20m ago' },
      { id: 'SUP-E-2', ticket: 'TKT-2002', user: 'Marco Rossi', owner: 'FINANCE', subject: 'Wire payout confirmation missing', status: 'IN_REVIEW', updated: '58m ago' },
      { id: 'SUP-E-3', ticket: 'TKT-2003', user: 'Daniel Kim', owner: 'TRADING', subject: 'MT5 trade history mismatch', status: 'RESOLVED', updated: '3h ago' },
    ],
  },
};

export const ticketDetails = {
  'TKT-1025': {
    id: 'TKT-1025',
    subject: 'Withdrawal Delay',
    user: 'Marco Rossi',
    priority: 'HIGH',
    status: 'OPEN',
    owner: 'Finance',
    createdAt: '2026-03-31 09:12',
    summary: 'Client reports a delay on a high-value withdrawal and requests treasury confirmation.',
    notes: [
      { time: '09:14', title: 'Ticket created', source: 'Client Portal', description: 'User reported delay after payout moved to manual approval.', status: 'OPEN' },
      { time: '09:18', title: 'Finance tagged', source: 'Support Agent / Lara', description: 'Escalated to treasury because the amount crossed the manual review threshold.', status: 'REVIEW' },
      { time: '09:24', title: 'Internal note added', source: 'Treasury', description: 'Source-of-funds check still in progress; expected completion within 30 minutes.', status: 'INFO' },
    ],
    internalNotes: [
      'VIP account. Keep response times under 15 minutes.',
      'Coordinate with treasury before sending customer-facing ETA.',
    ],
  },
  'TKT-1024': {
    id: 'TKT-1024',
    subject: '2FA Reset Request',
    user: 'Elena Vance',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    owner: 'Support',
    createdAt: '2026-03-31 08:02',
    summary: 'User cannot access the client portal after changing device and requested a 2FA reset.',
    notes: [
      { time: '08:05', title: 'Reset request verified', source: 'Support Agent / Noor', description: 'Identity confirmation initiated through secure channel.', status: 'REVIEW' },
    ],
    internalNotes: [
      'Identity verification completed through phone callback.',
    ],
  },
};
