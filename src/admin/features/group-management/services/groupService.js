const STORAGE_KEY = 'live_trader_admin_groups';

const DEFAULT_GROUPS = [
  {
    id: 1,
    name: 'Standard3',
    mt5GroupName: 'real\\WECNUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 5,
    firstDeposit: '0',
    maxWithdrawalPerDay: 5000,
    spreadStartFrom: '1.2',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-03'
  },
  {
    id: 2,
    name: 'Standard',
    mt5GroupName: 'real\\WECNUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 100,
    minDeposit: 50,
    minWithdrawal: 10,
    perProfileMaxAccount: 10,
    firstDeposit: '100',
    maxWithdrawalPerDay: 10000,
    spreadStartFrom: '1.5',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-03'
  },
  {
    id: 3,
    name: 'Zero Spread',
    mt5GroupName: 'real\\WECNUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 500,
    minDeposit: 100,
    minWithdrawal: 20,
    perProfileMaxAccount: 3,
    firstDeposit: '500',
    maxWithdrawalPerDay: 20000,
    spreadStartFrom: '0.0',
    accountOpenPolicy: 'Manual Audit Needed',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Manual Audit Needed',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-03'
  },
  {
    id: 4,
    name: 'Pro',
    mt5GroupName: 'real\\WECNUSD-6+6com',
    groupStatus: 'Inactive',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 1000,
    minDeposit: 200,
    minWithdrawal: 50,
    perProfileMaxAccount: 2,
    firstDeposit: '1000',
    maxWithdrawalPerDay: 50000,
    spreadStartFrom: '0.4',
    accountOpenPolicy: 'Manual Audit Needed',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Manual Audit Needed',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-04'
  },
  {
    id: 5,
    name: 'test0403',
    mt5GroupName: 'real\\WVIPUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 1,
    firstDeposit: '0',
    maxWithdrawalPerDay: 1000,
    spreadStartFrom: '2.0',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-04'
  },
  {
    id: 6,
    name: 'ECN',
    mt5GroupName: 'real\\WECNUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 200,
    minDeposit: 50,
    minWithdrawal: 20,
    perProfileMaxAccount: 4,
    firstDeposit: '200',
    maxWithdrawalPerDay: 15000,
    spreadStartFrom: '0.8',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-06'
  },
  {
    id: 7,
    name: 'MT5',
    mt5GroupName: 'real\\WVIPUSD',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 10,
    firstDeposit: '0',
    maxWithdrawalPerDay: 100000,
    spreadStartFrom: '1.0',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-06'
  },
  {
    id: 8,
    name: 'test',
    mt5GroupName: 'real\\real',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 5,
    firstDeposit: '0',
    maxWithdrawalPerDay: 1000,
    spreadStartFrom: '1.0',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-07'
  },
  {
    id: 9,
    name: 'test group name',
    mt5GroupName: 'real\\WECNEUR',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Dollar',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 2,
    firstDeposit: '0',
    maxWithdrawalPerDay: 1000,
    spreadStartFrom: '1.5',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-07'
  },
  {
    id: 10,
    name: 'krishn',
    mt5GroupName: 'real\\real',
    groupStatus: 'Active',
    groupType: 'Live',
    currencyUnit: 'Cent',
    minFirstDeposit: 0,
    minDeposit: 0,
    minWithdrawal: 0,
    perProfileMaxAccount: 1,
    firstDeposit: '0',
    maxWithdrawalPerDay: 500,
    spreadStartFrom: '3.0',
    accountOpenPolicy: 'Auto Approve',
    depositPolicy: 'Auto Approve',
    withdrawalPolicy: 'Auto Approve',
    tradingType: 'Standard Trading',
    maxLeverage: '1',
    date: '2025-03-07'
  }
];

function getStoredGroups() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GROUPS));
    return DEFAULT_GROUPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_GROUPS;
  }
}

function saveGroups(groups) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export const groupService = {
  list() {
    return getStoredGroups();
  },
  
  getById(id) {
    const groups = getStoredGroups();
    return groups.find(g => g.id === Number(id) || String(g.id) === String(id));
  },
  
  create(payload) {
    const groups = getStoredGroups();
    const newGroup = {
      ...payload,
      id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
      date: new Date().toISOString().substring(0, 10),
      // Enforce numeric formats
      minFirstDeposit: Number(payload.minFirstDeposit || 0),
      minDeposit: Number(payload.minDeposit || 0),
      minWithdrawal: Number(payload.minWithdrawal || 0),
      perProfileMaxAccount: Number(payload.perProfileMaxAccount || 0),
      maxWithdrawalPerDay: Number(payload.maxWithdrawalPerDay || 0)
    };
    groups.push(newGroup);
    saveGroups(groups);
    return newGroup;
  },
  
  update(id, payload) {
    const groups = getStoredGroups();
    const index = groups.findIndex(g => g.id === Number(id) || String(g.id) === String(id));
    if (index !== -1) {
      groups[index] = {
        ...groups[index],
        ...payload,
        id: groups[index].id, // Keep original ID
        date: groups[index].date, // Keep original creation date
        minFirstDeposit: Number(payload.minFirstDeposit || 0),
        minDeposit: Number(payload.minDeposit || 0),
        minWithdrawal: Number(payload.minWithdrawal || 0),
        perProfileMaxAccount: Number(payload.perProfileMaxAccount || 0),
        maxWithdrawalPerDay: Number(payload.maxWithdrawalPerDay || 0)
      };
      saveGroups(groups);
      return groups[index];
    }
    return null;
  },
  
  delete(id) {
    let groups = getStoredGroups();
    const initialLength = groups.length;
    groups = groups.filter(g => g.id !== Number(id) && String(g.id) !== String(id));
    saveGroups(groups);
    return groups.length !== initialLength;
  },
  
  listMt5Groups() {
    return [
      'real\\WECNUSD',
      'real\\WVIPUSD',
      'real\\WECNEUR',
      'real\\real',
      'real\\WECNUSD-6+6com',
      'demo\\WECNUSD',
      'demo\\WVIPUSD'
    ];
  },
  
  listPolicies() {
    return {
      accountOpenPolicies: ['Select Account Deposit Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Opening'],
      depositPolicies: ['Select Deposit Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Deposits'],
      withdrawalPolicies: ['Select withdrawal Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Withdrawals'],
      tradingTypes: ['Select Trading Type', 'Standard Trading', 'Hedging Only', 'Read Only']
    };
  }
};
