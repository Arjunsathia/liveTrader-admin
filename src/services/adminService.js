import { adminMgmtWorkspaces } from '../features/admin-mgmt/mocks/adminMgmtData';

export const adminService = {
  getWorkspace(slug = 'users') {
    return adminMgmtWorkspaces[slug] ?? adminMgmtWorkspaces.users;
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
    return { id: `ADMIN-${Date.now()}`, ...payload };
  },
  update(id, payload) {
    return { id, ...payload };
  },
  approve(item) {
    return { ...item, status: 'ACTIVE' };
  },
  reject(item) {
    return { ...item, status: 'REVIEW' };
  },
  export(slug) {
    return this.list(slug);
  },
};
