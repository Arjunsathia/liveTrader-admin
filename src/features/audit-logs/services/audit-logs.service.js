import { auditLogsWorkspaces } from '../data/audit-logs-data';

export const auditLogsService = {
  getWorkspace(slug = 'access-logs') {
    return auditLogsWorkspaces[slug] ?? auditLogsWorkspaces['access-logs'];
  },
  list(slug) {
    return this.getWorkspace(slug).rows;
  },
  getById(slug, id) {
    return this.getWorkspace(slug).rows.find((row) => row.id === id);
  },
};
