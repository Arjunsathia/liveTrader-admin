import { supportWorkspaces, ticketDetails } from '../features/support/mocks/supportData';

export const supportService = {
  getWorkspace(slug = 'tickets') {
    return supportWorkspaces[slug] ?? supportWorkspaces.tickets;
  },
  getMetrics(slug) {
    return this.getWorkspace(slug).metrics;
  },
  list(slug) {
    return this.getWorkspace(slug).rows;
  },
  getById(ticketId) {
    return ticketDetails[ticketId];
  },
  create(payload) {
    return { id: `TKT-${Date.now()}`, ...payload };
  },
  update(id, payload) {
    return { id, ...payload };
  },
  approve(item) {
    return { ...item, status: 'RESOLVED' };
  },
  reject(item) {
    return { ...item, status: 'ESCALATED' };
  },
  export(slug) {
    return this.list(slug);
  },
};
