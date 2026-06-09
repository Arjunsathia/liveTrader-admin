/**
 * LiveTrader Admin - REST API Client
 * Premium fetch-based wrapper with token injection, timeout, and unified error handling.
 */

const DEFAULT_TIMEOUT = 15000; // 15 seconds

const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
};

class ApiError extends Error {
  constructor(status, statusText, data) {
    super(data?.message || statusText || `HTTP Error ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, data);
  }

  return data;
};

const request = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = DEFAULT_TIMEOUT,
    ...extraOpts
  } = options;

  const url = `${getBaseUrl()}${endpoint}`;
  
  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Read auth token from localStorage
  const token = localStorage.getItem('admin_token');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal: controller.signal,
    ...extraOpts,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${method} -> ${url}`, body || '');
    }
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    
    const parsedData = await parseResponse(response);
    
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${method} -> ${url} (${response.status})`, parsedData);
    }
    
    return parsedData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', { message: `Request exceeded timeout of ${timeout}ms` });
    }
    
    if (error instanceof ApiError) {
      // Auto-handle 401 Unauthorized (e.g. redirect to login or clear token)
      if (error.status === 401) {
        localStorage.removeItem('admin_token');
        // Optional: window.location.href = '/login';
      }
      throw error;
    }
    
    // Network / connection errors
    throw new ApiError(0, 'Network Connection Error', { message: error.message || 'Unable to connect to service.' });
  }
};

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
