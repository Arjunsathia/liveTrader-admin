import { ibSystemWorkspaces } from '@features/ib-system/data/ibSystemData';

export const ibSystemService = {
  getWorkspace(slug = 'referrals') {
    return ibSystemWorkspaces[slug] ?? ibSystemWorkspaces.referrals;
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
    return { id: `IB-${Date.now()}`, ...payload };
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
