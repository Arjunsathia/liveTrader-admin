import { adminRouteModules } from '@config/routes/admin-routes.config';

export const adminNavigationSections = [
  { id: 'main', label: 'Main' },
  { id: 'management', label: 'Management' },
  { id: 'system', label: 'System' },
];

export const adminNavigation = adminRouteModules.map((module) => ({
  id: module.id,
  label: module.label,
  icon: module.icon,
  path: module.defaultPath,
  permission: module.permission,
  navSection: module.navSection,
  subItems: module.routes
    .filter((route) => route.navLabel)
    .map((route) => ({
      id: route.id,
      label: route.navLabel,
      path: route.path,
      permission: route.permission,
    })),
}));
