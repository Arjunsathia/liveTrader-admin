import {
  dashboardAnalytics,
  dashboardKpis,
  dashboardTables,
  operationsTasks,
  quickActions,
  recentActivity,
} from '@features/dashboard/data/dashboardData';

export const dashboardService = {
  getKpis() {
    return dashboardKpis;
  },
  getAnalytics() {
    return dashboardAnalytics;
  },
  getTasks() {
    return operationsTasks;
  },
  getQuickActions() {
    return quickActions;
  },
  getRecentActivity() {
    return recentActivity;
  },
  getTables() {
    return dashboardTables;
  },
};
