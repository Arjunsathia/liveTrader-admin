import { supportWorkspaces, ticketDetails, ticketsData } from '@features/support/data/mockData';

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
    // Check rich dataset first, then legacy ticketDetails
    const rich = ticketsData.find((t) => t.id === ticketId);
    return rich ?? ticketDetails[ticketId] ?? null;
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
