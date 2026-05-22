import { financeRows, tradingRows, userRows, systemRows } from '@features/reports/data/mockData';

const reportsWorkspaces = {
  finance:     { rows: financeRows },
  trading:     { rows: tradingRows },
  users:       { rows: userRows },
  system:      { rows: systemRows },
  overview:    { rows: [] },
  exports:     { rows: [] },
};

export const reportsService = {
  getWorkspace(slug = 'finance') {
    return reportsWorkspaces[slug] ?? reportsWorkspaces.finance;
  },
  getMetrics(slug) {
    return this.getWorkspace(slug).metrics;
  },
  list(slug) {
    return this.getWorkspace(slug).rows;
  },
  getById(slug, id) {
    return this.getWorkspace(slug).rows.find((row) => row.id === id);
  },
  create(payload) {
    return { id: `REP-${Date.now()}`, ...payload };
  },
  update(id, payload) {
    return { id, ...payload };
  },
  approve(item) {
    return { ...item, status: 'READY' };
  },
  reject(item) {
    return { ...item, status: 'FAILED' };
  },
  export(slug) {
    return this.list(slug);
  },
};
