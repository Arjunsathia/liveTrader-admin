import { adminRouteModules } from '@config/routes/admin-routes.config';

/**
 * Sidebar Navigation Sections
 * 
 * Defines the high-level groupings for the sidebar navigation menu.
 */
export const adminNavigationSections = [
  { id: 'main', label: 'Main' },
  { id: 'management', label: 'Management' },
  { id: 'system', label: 'System' },
];

/**
 * Main Sidebar Navigation Configuration
 * 
 * Automatically built from the `adminRouteModules` configuration so that
 * routes and sidebar links remain perfectly synchronized.
 * Filters out any routes that do not have a `navLabel`.
 */
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
