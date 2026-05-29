import { mt5Accounts, userActivityFeed, userMetrics, users, adminAuditLogs } from '@/config/constants/MOCK_USERS';

export const usersService = {
  getMetrics() {
    return userMetrics;
  },
  list() {
    return users;
  },
  listActivity() {
    return userActivityFeed;
  },
  listMt5Accounts() {
    return mt5Accounts;
  },
  getById(userId) {
    return users.find((user) => user.id === userId || user.uid === userId);
  },
  create(payload) {
    return {
      id: `usr-${Date.now()}`,
      uid: String(Math.floor(10000 + Math.random() * 89999)),
      kycStatus: 'PENDING',
      riskStatus: 'LOW',
      fundingState: 'PENDING',
      walletBalance: '$0.00',
      equity: '$0.00',
      pnl30d: '$0',
      openPositions: 0,
      mt5Accounts: 0,
      registered: '2026-03-31 10:00',
      lastSeen: 'Just now',
      source: 'Manual Admin Entry',
      address: payload.address,
      notesSummary: payload.note,
      kyc: {
        level: 'Level 0',
        submittedAt: 'Not submitted',
        reviewer: 'Pending',
        status: 'PENDING',
        documents: [],
        aml: 'Awaiting submission.',
      },
      wallet: [],
      mt5: [],
      tradingHistory: [],
      activity: [],
      tags: ['Retail FX', 'Standard'],
      sessions: [
        { id: 'sess-1', device: 'Windows 11 · Chrome Pro', ip: '192.168.1.105', location: 'Singapore (SG)', lastActive: 'Just now' }
      ],
      risk: {
        score: '0 / 100',
        exposure: '$0',
        concentration: 'None',
        drawdown: '0%',
        status: 'LOW',
        alerts: ['New profile awaiting onboarding.'],
      },
      notes: [],
      ...payload,
    };
  },
  update(userId, payload) {
    const userIndex = users.findIndex((item) => item.id === userId || item.uid === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...payload };
      return users[userIndex];
    }
    return null;
  },
  createMt5AccountForUser(userId, accountData) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user) return null;

    const login = accountData.login || String(Math.floor(88100000 + Math.random() * 899999));
    const server = accountData.server || 'MT5-LIVE-EU1';
    const group = accountData.group || 'REAL_RAW_SPREAD';
    const leverage = accountData.leverage || '1:100';
    const deposit = accountData.deposit || '1000';
    const equityStr = `$${parseFloat(deposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const newAcct = {
      login,
      server,
      group,
      leverage,
      equity: equityStr,
      balance: equityStr,
      margin: '$0.00',
      freeMargin: equityStr,
      marginLvl: '—',
      status: 'CONNECTED',
      lastSync: 'Just now',
    };

    if (!user.mt5) user.mt5 = [];
    user.mt5.push(newAcct);
    user.mt5Accounts = user.mt5.length;

    // Adjust user net equity if there was a deposit
    const existingEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    user.equity = `$${(existingEquity + parseFloat(deposit)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Add to global mt5Accounts inventory
    const newGlobalRecord = {
      id: `MT5-${Date.now()}-${login}`,
      login,
      userId: user.id,
      user: user.name,
      server,
      status: 'CONNECTED',
      connection: 'HEALTHY',
      group,
      leverage,
      balance: equityStr,
      lastSync: 'Just now',
    };
    mt5Accounts.push(newGlobalRecord);

    return newAcct;
  },
  updateMt5AccountForUser(userId, login, accountData) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user) return null;

    // Update inside user's local mt5 array
    if (user.mt5) {
      const idx = user.mt5.findIndex((item) => item.login === login);
      if (idx !== -1) {
        user.mt5[idx] = { ...user.mt5[idx], ...accountData };
      }
    }

    // Update inside global mt5Accounts array
    const gIdx = mt5Accounts.findIndex((item) => item.login === login);
    if (gIdx !== -1) {
      mt5Accounts[gIdx] = { ...mt5Accounts[gIdx], ...accountData };
      if (accountData.balance) {
        mt5Accounts[gIdx].balance = accountData.balance;
      }
    }
  },
  deleteMt5AccountForUser(userId, login) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user) return false;

    // Remove from user's local mt5 array
    if (user.mt5) {
      const initialLen = user.mt5.length;
      user.mt5 = user.mt5.filter((item) => item.login !== login);
      user.mt5Accounts = user.mt5.length;
      if (user.mt5.length === initialLen) return false;
    }

    // Remove from global mt5Accounts array
    const gIdx = mt5Accounts.findIndex((item) => item.login === login);
    if (gIdx !== -1) {
      mt5Accounts.splice(gIdx, 1);
    }
    return true;
  },
  updateUserTags(userId, tags) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (user) {
      user.tags = tags;
      return user;
    }
    return null;
  },
  updateUserTierAndSegment(userId, tier, segment) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (user) {
      user.tier = tier;
      user.segment = segment;
      return user;
    }
    return null;
  },
  revokeUserSession(userId, sessionId) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (user && user.sessions) {
      user.sessions = user.sessions.filter((s) => s.id !== sessionId);
      return user;
    }
    return null;
  },
  approve(item) {
    const user = users.find((u) => u.id === item.id || u.uid === item.id);
    if (user) {
      user.kycStatus = 'VERIFIED';
      if (user.kyc) user.kyc.status = 'VERIFIED';
    }
    return { ...item, status: 'APPROVED' };
  },
  reject(item) {
    const user = users.find((u) => u.id === item.id || u.uid === item.id);
    if (user) {
      user.kycStatus = 'REJECTED';
      if (user.kyc) user.kyc.status = 'REJECTED';
    }
    return { ...item, status: 'REJECTED' };
  },
  listAdminAuditLogs() {
    return adminAuditLogs;
  },
  logAdminAction(author, target, action) {
    const logEntry = {
      id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      author,
      target,
      action,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    adminAuditLogs.unshift(logEntry);
    return logEntry;
  },
  updateUserSecurityRestrictions(userId, locks) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (user) {
      user.withdrawalsBlocked = locks.withdrawalsBlocked;
      user.readOnlyTerminals = locks.readOnlyTerminals;
      user.apiBlocked = locks.apiBlocked;
      return user;
    }
    return null;
  },
  updateUserRebateRate(userId, rate) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (user) {
      user.rebateRate = rate;
      return user;
    }
    return null;
  },
  forceCloseUserPosition(userId, ticketId) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user || !user.livePositions) return null;

    const posIndex = user.livePositions.findIndex((p) => p.ticket === ticketId);
    if (posIndex === -1) return null;

    const position = user.livePositions[posIndex];
    user.livePositions.splice(posIndex, 1);

    // Parse PNL
    const pnlVal = parseFloat(position.pnl.replace(/[$,+]/g, '')) || 0;
    const closedTrade = {
      ticket: position.ticket,
      symbol: position.symbol,
      side: position.side,
      lots: position.lots,
      open: position.openPrice,
      close: position.livePrice,
      pnl: position.pnl,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    if (!user.tradingHistory) user.tradingHistory = [];
    user.tradingHistory.unshift(closedTrade);

    // Update wallet balance and equity
    let currentBalance = parseFloat((user.walletBalance || '$0').replace(/[$,]/g, '')) || 0;
    const newBalance = currentBalance + pnlVal;
    user.walletBalance = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    let currentEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    const newEquity = currentEquity + pnlVal;
    user.equity = `$${newEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return { user, position };
  },
  forceHedgeUserPosition(userId, ticketId) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user || !user.livePositions) return null;

    const position = user.livePositions.find((p) => p.ticket === ticketId);
    if (!position) return null;

    const hedgeSide = position.side === 'BUY' ? 'SELL' : 'BUY';
    const hedgeTicket = String(Math.floor(9900000 + Math.random() * 99999));
    const hedgePosition = {
      ticket: hedgeTicket,
      symbol: position.symbol,
      side: hedgeSide,
      lots: position.lots,
      openPrice: position.livePrice,
      livePrice: position.livePrice,
      swaps: '$0.00',
      commissions: position.commissions,
      pnl: '$0.00',
    };

    user.livePositions.push(hedgePosition);
    return { user, hedgePosition };
  },
  adjustUserBalance(userId, asset, amount, type) {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    if (!user) return null;
    
    const change = type === 'CREDIT' ? amount : -amount;
    
    // Update user walletBalance
    let currentBalance = parseFloat((user.walletBalance || '$0').replace(/[$,]/g, '')) || 0;
    const newBalance = currentBalance + change;
    user.walletBalance = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    let currentEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    const newEquity = currentEquity + change;
    user.equity = `$${newEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Update user wallet history
    const newTx = {
      id: `TX-${Math.floor(40000 + Math.random() * 59999)}`,
      type: type === 'CREDIT' ? 'DEPOSIT' : 'WITHDRAWAL',
      amount: `${change >= 0 ? '+' : '-'}$${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      method: 'Internal Manual Adjustment',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'SUCCESS'
    };
    if (!user.walletHistory) user.walletHistory = [];
    user.walletHistory.unshift(newTx);
    
    return user;
  },
  export() {
    return users;
  },
};

