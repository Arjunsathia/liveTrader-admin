import { financeWorkspaces } from '../features/finance/mocks/financeData';

export const financeService = {
  getWorkspace(slug = 'deposits') {
    return financeWorkspaces[slug] ?? financeWorkspaces.deposits;
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
    return { id: `FIN-${Date.now()}`, ...payload };
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
