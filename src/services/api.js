import axios from 'axios';
import { getToken, removeToken, setToken } from '../utils/auth';

// Get API base URL from environment or default (backend runs on port 5000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds to handle long downloads and operations
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH ENDPOINTS
export const authAPI = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  verify: () => 
    apiClient.get('/auth/verify'),
  
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    apiClient.post('/admin/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  
  getProfile: () =>
    apiClient.get('/admin/auth/profile'),
  
  updateEmail: (newEmail, password) =>
    apiClient.post('/admin/auth/update-email', { new_email: newEmail, password }),
};

// DASHBOARD & ANALYTICS ENDPOINTS
export const analyticsAPI = {
  getDashboardStats: () =>
    apiClient.get('/admin/dashboard/stats'),
  
  getAnalyticsByRange: (startDate, endDate) =>
    apiClient.get('/admin/analytics/range', {
      params: { start_date: startDate, end_date: endDate },
    }),
  
  getPlatformAnalytics: () =>
    apiClient.get('/admin/analytics/platforms'),
  
  getCountryAnalytics: () =>
    apiClient.get('/admin/analytics/countries'),
  
  getDeviceAnalytics: () =>
    apiClient.get('/admin/analytics/devices'),
  
  getDownloadLogs: (limit = 20, skip = 0, filters = {}) =>
    apiClient.get('/admin/analytics/logs', {
      params: { limit, skip, ...filters },
    }),
};

// BLOG ENDPOINTS
export const blogAPI = {
  // Public endpoints
  getPublicPosts: () =>
    apiClient.get('/blog/posts'),
  
  getPublicPost: (id) =>
    apiClient.get(`/blog/posts/${id}`),
  
  incrementPostView: (id) =>
    apiClient.post(`/blog/posts/${id}/view`),
  
  // Admin endpoints
  getAdminPosts: () =>
    apiClient.get('/admin/blog/posts'),
  
  createPost: (postData) =>
    apiClient.post('/admin/blog/posts', postData),
  
  updatePost: (id, postData) =>
    apiClient.put(`/admin/blog/posts/${id}`, postData),
  
  deletePost: (id) =>
    apiClient.delete(`/admin/blog/posts/${id}`),
};

// SETTINGS ENDPOINTS
export const settingsAPI = {
  getSettings: () =>
    apiClient.get('/settings'),
  
  getAdminSettings: () =>
    apiClient.get('/admin/settings'),
  
  updateGeneralSettings: (settingsData) =>
    apiClient.post('/admin/settings/general', settingsData),
  
  updateSecuritySettings: (settingsData) =>
    apiClient.post('/admin/settings/security', settingsData),
  
  updateFeatureSettings: (featuresData) =>
    apiClient.post('/admin/settings/features', featuresData),
};

// DOWNLOAD ENDPOINTS (Public)
export const downloadAPI = {
  startDownload: (url, platform, format = "mp4") =>
    apiClient.post('/download', { url, platform, format }),
  
  getDownloadStatus: (downloadId) =>
    apiClient.get(`/download/${downloadId}`),
  
  convert: (url, format = "mp3") =>
    apiClient.post('/convert', { url, format }),
};

// Health check
export const healthCheck = () =>
  axios.get(`${API_BASE_URL.replace('/api', '')}/health`);

export default apiClient;
