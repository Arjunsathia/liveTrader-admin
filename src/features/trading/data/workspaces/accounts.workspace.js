import { Monitor, Activity, Lock, Wallet, ShieldAlert, Radio } from 'lucide-react';

export const ACCOUNT_ROWS = [
  { id: 'A1', login: '100142', user: 'k.mueller', uid: 'U-8821', type: 'Live', server: 'MT5-EU1', balance: '$12,840', equity: '$13,182', margin: '$1,240', freeMargin: '$11,942', marginLvl: '1,063%', leverage: '1:100', status: 'ACTIVE', lastSync: '1m ago', group: 'retail_usd_std', currency: 'USD' },
  { id: 'A2', login: '100143', user: 'k.mueller', uid: 'U-8821', type: 'Demo', server: 'MT5-DEMO', balance: '$50,000', equity: '$50,000', margin: '$0', freeMargin: '$50,000', marginLvl: '—', leverage: '1:500', status: 'ACTIVE', lastSync: '4m ago', group: 'demo_usd', currency: 'USD' },
  { id: 'A3', login: '100201', user: 'p.sharma', uid: 'U-4102', type: 'Live', server: 'MT5-EU2', balance: '$7,710', equity: '$7,582', margin: '$640', freeMargin: '$6,942', marginLvl: '1,185%', leverage: '1:200', status: 'ACTIVE', lastSync: '2m ago', group: 'retail_usd_std', currency: 'USD' },
  { id: 'A4', login: '100334', user: 'f.martin', uid: 'U-7723', type: 'Live', server: 'MT5-EU1', balance: '$39,200', equity: '$38,811', margin: '$4,100', freeMargin: '$34,711', marginLvl: '946%', leverage: '1:100', status: 'ACTIVE', lastSync: '1m ago', group: 'vip_usd_std', currency: 'USD' },
  { id: 'A5', login: '100455', user: 'a.okonkwo', uid: 'U-5519', type: 'Live', server: 'MT5-APAC', balance: '$3,100', equity: '$3,100', margin: '$0', freeMargin: '$3,100', marginLvl: '—', leverage: '1:50', status: 'BLOCKED', lastSync: '6h ago', group: 'retail_usd_std', currency: 'USD' },
  { id: 'A6', login: '100512', user: 'n.tanaka', uid: 'U-2290', type: 'Live', server: 'MT5-APAC', balance: '$5,841', equity: '$5,920', margin: '$480', freeMargin: '$5,440', marginLvl: '1,233%', leverage: '1:100', status: 'ACTIVE', lastSync: '3m ago', group: 'retail_usd_std', currency: 'USD' },
  { id: 'A7', login: '100600', user: 'l.chen', uid: 'U-9910', type: 'Live', server: 'MT5-EU1', balance: '$11,600', equity: '$11,600', margin: '$0', freeMargin: '$11,600', marginLvl: '—', leverage: '1:100', status: 'ACTIVE', lastSync: '8m ago', group: 'retail_usd_std', currency: 'USD' },
  { id: 'A8', login: '100701', user: 'h.ali', uid: 'U-6640', type: 'Live', server: 'MT5-EU2', balance: '$8,921', equity: '$9,102', margin: '$720', freeMargin: '$8,382', marginLvl: '1,264%', leverage: '1:200', status: 'ACTIVE', lastSync: '2m ago', group: 'retail_usd_std', currency: 'USD' },
];

export const accountsConfig = {
  title: 'Trading Accounts',
  tableTitle: 'Account Register',
  tableSubtitle: 'All MT5 accounts — live, demo, and blocked',
  rows: ACCOUNT_ROWS,
  searchFields: ['login', 'user', 'uid', 'server', 'group', 'type'],
  kpis: [
    { label: 'Total Accounts', value: '8', sub: 'all types', Icon: Monitor, accent: 'var(--brand)' },
    { label: 'Active', value: '7', sub: 'trading now', Icon: Activity, accent: 'var(--positive)' },
    { label: 'Blocked', value: '1', sub: 'restricted', Icon: Lock, accent: 'var(--negative)' },
    { label: 'Total Equity', value: '$142,237', sub: 'across all live', Icon: Wallet, accent: 'var(--cyan)' },
    { label: 'Margin Used', value: '$8,663', sub: 'platform total', Icon: ShieldAlert, accent: 'var(--warning)' },
    { label: 'Live Accounts', value: '6', sub: 'funded', Icon: Radio, accent: 'var(--purple)' },
  ],
  statusOpts: ['ACTIVE', 'BLOCKED', 'READONLY', 'SUSPENDED'],
  typeOpts: ['Live', 'Demo'],
  serverOpts: ['MT5-EU1', 'MT5-EU2', 'MT5-APAC', 'MT5-DEMO'],
  leverageOpts: ['1:50', '1:100', '1:200', '1:500'],
  columns: [
    { key: 'login', label: 'Login', type: 'mono' },
    { key: 'user', label: 'User', type: 'user' },
    { key: 'type', label: 'Type', type: 'tag' },
    { key: 'server', label: 'Server', type: 'mono' },
    { key: 'balance', label: 'Balance', type: 'amount' },
    { key: 'equity', label: 'Equity', type: 'amount' },
    { key: 'marginLvl', label: 'Margin Lvl', type: 'mono' },
    { key: 'leverage', label: 'Leverage', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastSync', label: 'Last Sync', type: 'mono' },
  ],
};
