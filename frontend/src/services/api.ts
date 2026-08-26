import axios from 'axios';
import { ApiResponse } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('myos_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse: ApiResponse = error.response?.data || {
      success: false,
      message: error.message || 'Network error occurred',
      errorCode: 'NETWORK_ERROR',
    };
    return Promise.reject(errorResponse);
  }
);

export default api;
