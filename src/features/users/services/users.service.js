import { mt5Accounts, userActivityFeed, userMetrics, users } from '@features/users/data/mockData';

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
  export() {
    return users;
  },
};

