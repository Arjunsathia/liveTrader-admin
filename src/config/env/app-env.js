/**
 * Environment Configuration
 * 
 * Centralized file for handling environment variables. 
 * Since we are currently in the frontend design and layout phase, 
 * `enableMockData` should default to `true` to populate the UI with 
 * dummy data until the real backend APIs are integrated.
 */
export const appEnv = {
  appName: import.meta.env.VITE_APP_NAME ?? 'LiveTrader Admin',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL ?? '',
  // Mock data is explicitly enabled for the frontend design phase
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
};

/**
 * Utility to strictly require an environment variable. 
 * Will throw an error if the key is missing.
 */
export function getRequiredEnv(key) {
  const value = appEnv[key];
  if (!value) {
    throw new Error(`Missing required environment value: ${key}`);
  }
  return value;
}
