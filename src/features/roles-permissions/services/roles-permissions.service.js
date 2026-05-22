import { rolesPermissionsWorkspaces } from '../data/mockData';

export const rolesPermissionsService = {
  getWorkspace(slug = 'users') {
    return rolesPermissionsWorkspaces[slug] ?? rolesPermissionsWorkspaces.users;
  },
  list(slug) {
    return this.getWorkspace(slug).rows;
  },
  getById(slug, id) {
    return this.getWorkspace(slug).rows.find((row) => row.id === id);
  },
};
