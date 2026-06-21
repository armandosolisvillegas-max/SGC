import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Proxied to http://localhost:8080/api via vite.config.js
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sgc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for basic error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Checks if an error is a network connection error (e.g. backend is not running)
 */
export const isNetworkError = (error) => {
  return !error.response && error.code !== 'ECONNABORTED';
};

export default axiosClient;
