import { copyTradingWorkspaces } from '../features/copy-trading/data/copyTradingData';

export const copyTradingService = {
  getWorkspace(slug = 'strategies') {
    return copyTradingWorkspaces[slug] ?? copyTradingWorkspaces.strategies;
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
    return { id: `CPY-${Date.now()}`, ...payload };
  },
  update(id, payload) {
    return { id, ...payload };
  },
  approve(item) {
    return { ...item, status: 'APPROVED' };
  },
  reject(item) {
    return { ...item, status: 'REJECTED' };
  },
  export(slug) {
    return this.list(slug);
  },
};
