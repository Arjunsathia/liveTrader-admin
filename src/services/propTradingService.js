import { propTradingWorkspaces } from '../features/prop-trading/mocks/propTradingData';

export const propTradingService = {
  getWorkspace(slug = 'overview') {
    const normalized = slug === '' ? 'overview' : slug;
    return propTradingWorkspaces[normalized] ?? propTradingWorkspaces.overview;
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
    return { id: `PROP-${Date.now()}`, ...payload };
  },
  update(id, payload) {
    return { id, ...payload };
  },
  approve(item) {
    return { ...item, decision: 'APPROVE', status: 'APPROVED' };
  },
  reject(item) {
    return { ...item, decision: 'REJECT', status: 'REJECTED' };
  },
  export(slug) {
    return this.list(slug);
  },
};
