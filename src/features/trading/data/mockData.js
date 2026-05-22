export const tradingWorkspaces = {
  accounts: {
    eyebrow: 'Trading Operations',
    title: 'Trading Accounts',
    description: 'Live account exposure, connection status, and leverage posture.',
    tableTitle: 'Trading Accounts',
    tableSubtitle: 'Connected and monitored accounts',
    metrics: [
      { label: 'Connected Accounts', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'CONNECTED', label: 'Connected' }, { value: 'LIMITED', label: 'Limited' }, { value: 'DISCONNECTED', label: 'Disconnected' }] },
      { key: 'group', label: 'Group', options: [{ value: 'VIP\\FX', label: 'VIP FX' }, { value: 'Institutional\\Copy', label: 'Institutional Copy' }, { value: 'Retail\\FX', label: 'Retail FX' }] },
    ],
    columns: [
      { key: 'login', label: 'Login', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'group', label: 'Group' },
      { key: 'leverage', label: 'Leverage' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'equity', label: 'Equity', type: 'amount' },
    ],
    rows: [
      { id: 'TA-DEMO', login: '0000', user: 'Demo User', group: 'Demo', leverage: '1:100', status: 'CONNECTED', equity: '$0' },
    ],
  },
  orders: {
    eyebrow: 'Trading Operations',
    title: 'Orders',
    description: 'Open orders, route destination, and fill quality monitoring.',
    tableTitle: 'Orders Monitor',
    tableSubtitle: 'Active and recently routed orders',
    metrics: [
      { label: 'Open Orders', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'symbol', label: 'Symbol', options: [{ value: 'EUR/USD', label: 'EUR/USD' }, { value: 'XAU/USD', label: 'XAU/USD' }, { value: 'BTC/USD', label: 'BTC/USD' }] },
      { key: 'status', label: 'Status', options: [{ value: 'ROUTED', label: 'Routed' }, { value: 'PARTIAL', label: 'Partial' }, { value: 'HOLD', label: 'Hold' }] },
    ],
    columns: [
      { key: 'ticket', label: 'Ticket', type: 'mono' },
      { key: 'symbol', label: 'Symbol' },
      { key: 'user', label: 'User' },
      { key: 'side', label: 'Side', type: 'status' },
      { key: 'size', label: 'Size' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows: [
      { id: 'ORD-DEMO', ticket: '0000', symbol: 'EUR/USD', user: 'Demo User', side: 'BUY', size: '0.0', status: 'ROUTED' },
    ],
  },
  positions: {
    eyebrow: 'Trading Operations',
    title: 'Positions',
    description: 'Live exposure by account, symbol, and unrealized PnL.',
    tableTitle: 'Live Positions',
    tableSubtitle: 'Real-time positions across the platform',
    metrics: [
      { label: 'Live Positions', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'symbol', label: 'Symbol', options: [{ value: 'EUR/USD', label: 'EUR/USD' }, { value: 'GBP/JPY', label: 'GBP/JPY' }, { value: 'BTC/USD', label: 'BTC/USD' }] },
      { key: 'side', label: 'Side', options: [{ value: 'BUY', label: 'Buy' }, { value: 'SELL', label: 'Sell' }] },
    ],
    columns: [
      { key: 'symbol', label: 'Symbol' },
      { key: 'user', label: 'User' },
      { key: 'side', label: 'Side', type: 'status' },
      { key: 'size', label: 'Size' },
      { key: 'entry', label: 'Entry', type: 'mono' },
      { key: 'pnl', label: 'PnL', type: 'amount' },
    ],
    rows: [
      { id: 'POS-DEMO', symbol: 'EUR/USD', user: 'Demo User', side: 'BUY', size: '0', entry: '0', pnl: '$0' },
    ],
  },
  history: {
    eyebrow: 'Trading Operations',
    title: 'Trade History',
    description: 'Closed trades, realized PnL, and execution traceability.',
    tableTitle: 'Trade History',
    tableSubtitle: 'Historical fills and settlements',
    metrics: [
      { label: 'Trades Today', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'side', label: 'Side', options: [{ value: 'BUY', label: 'Buy' }, { value: 'SELL', label: 'Sell' }] },
      { key: 'symbol', label: 'Symbol', options: [{ value: 'EUR/USD', label: 'EUR/USD' }, { value: 'XAU/USD', label: 'XAU/USD' }, { value: 'BTC/USD', label: 'BTC/USD' }] },
    ],
    columns: [
      { key: 'ticket', label: 'Ticket', type: 'mono' },
      { key: 'symbol', label: 'Symbol' },
      { key: 'user', label: 'User' },
      { key: 'side', label: 'Side', type: 'status' },
      { key: 'pnl', label: 'PnL', type: 'amount' },
      { key: 'time', label: 'Closed', type: 'mono' },
    ],
    rows: [
      { id: 'TH-DEMO', ticket: '0000', symbol: 'EUR/USD', user: 'Demo User', side: 'BUY', pnl: '$0', time: '00:00' },
    ],
  },
  'execution-logs': {
    eyebrow: 'Trading Operations',
    title: 'Execution Logs',
    description: 'Bridge events, LP latency, and execution anomalies.',
    tableTitle: 'Execution Logs',
    tableSubtitle: 'Infrastructure and order-routing events',
    metrics: [
      { label: 'Execution Logs', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'level', label: 'Level', options: [{ value: 'INFO', label: 'Info' }, { value: 'WARNING', label: 'Warning' }, { value: 'CRITICAL', label: 'Critical' }] },
      { key: 'bridge', label: 'Bridge', options: [{ value: 'Gateway A', label: 'Gateway A' }, { value: 'Gateway B', label: 'Gateway B' }, { value: 'LMAX Cluster', label: 'LMAX Cluster' }] },
    ],
    columns: [
      { key: 'id', label: 'Log ID', type: 'mono' },
      { key: 'bridge', label: 'Bridge' },
      { key: 'event', label: 'Event' },
      { key: 'level', label: 'Level', type: 'status' },
      { key: 'latency', label: 'Latency', type: 'mono' },
      { key: 'time', label: 'Timestamp', type: 'mono' },
    ],
    rows: [
      { id: 'EXE-DEMO', bridge: 'System', event: 'Demo Log', level: 'INFO', latency: '0ms', time: '00:00:00' },
    ],
  },
};
