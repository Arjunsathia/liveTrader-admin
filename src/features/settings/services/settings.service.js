import { settingsWorkspaces } from '@features/settings/data/settingsData';

export const settingsService = {
  getWorkspace(slug = 'api') {
    return settingsWorkspaces[slug] ?? settingsWorkspaces.api;
  },
  getMetrics() {
    return [];
  },
  list(slug) {
    return this.getWorkspace(slug).groups;
  },
  getById(slug, id) {
    return this.getWorkspace(slug).groups.find((group) => group.title === id);
  },
  create(payload) {
    return payload;
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
