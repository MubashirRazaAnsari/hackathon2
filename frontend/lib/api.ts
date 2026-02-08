import axios from 'axios';

import { authClient } from './auth-client';

const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  // If it's a relative URL (starts with /), let the browser handle it
  // Otherwise, ensure it's a valid absolute URL for server-side calls
  if (typeof window === 'undefined' && url.startsWith('/')) {
    return 'http://localhost:3000'; // Fallback for server-side build time
  }
  return url;
};

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Better Auth stores the session in a cookie, but we can also get 
    // the session object which contains the token string.
    const { data: session } = await authClient.getSession();
    
    // Better Auth client handles the token automatically via cookies if on same domain,
    // but for cross-domain/port requests (localhost:3000 -> localhost:8000), 
    // we manually attach the session token if available.
    if (session?.session?.token) {
      config.headers.Authorization = `Bearer ${session.session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if session is invalid/expired
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;