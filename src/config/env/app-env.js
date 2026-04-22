export const appEnv = {
  appName: import.meta.env.VITE_APP_NAME ?? 'LiveTrader Admin',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL ?? '',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
};

export function getRequiredEnv(key) {
  const value = appEnv[key];
  if (!value) {
    throw new Error(`Missing required environment value: ${key}`);
  }
  return value;
}
