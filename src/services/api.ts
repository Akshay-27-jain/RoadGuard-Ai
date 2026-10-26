import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to outbound requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roadguard_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s and attempt token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('roadguard_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const newAccessToken = res.data.access_token;
          localStorage.setItem('roadguard_access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh failed — clear credentials
          localStorage.removeItem('roadguard_access_token');
          localStorage.removeItem('roadguard_refresh_token');
          localStorage.removeItem('roadguard_user');
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Complaints API
export const ComplaintsAPI = {
  submit: (formData: FormData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyComplaints: () => api.get('/complaints/my'),
  getByRef: (ref: string) => api.get(`/complaints/ref/${ref}`),
  getById: (id: string) => api.get(`/complaints/${id}`),
  list: (params?: { status?: string; ward?: string; severity?: string; skip?: number; limit?: number }) =>
    api.get('/complaints', { params }),
  support: (id: string) => api.post(`/complaints/${id}/support`),
  reverseGeocode: (lat: number, lng: number) =>
    api.get('/complaints/geocode/reverse', { params: { latitude: lat, longitude: lng } }),
};

// Officer Tasks API
export const OfficerAPI = {
  getTasks: (params?: { status?: string; severity?: string; skip?: number; limit?: number }) =>
    api.get('/officers/tasks', { params }),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/officers/tasks/${id}/status`, { status, notes }),
  submitRepair: (id: string, formData: FormData) =>
    api.post(`/officers/tasks/${id}/repair`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Admin Operations API
export const AdminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getOfficers: () => api.get('/admin/officers'),
  createOfficer: (data: {
    name: string;
    email: string;
    password: string;
    ward: string;
    department?: string;
    phone?: string;
  }) => api.post('/admin/officers', data),
  updateOfficerStatus: (id: string, is_active: boolean) =>
    api.patch(`/admin/officers/${id}/status`, { is_active }),
  assignComplaint: (id: string, data: { officer_id: string; notes?: string }) =>
    api.post(`/admin/complaints/${id}/assign`, data),
  verifyRepair: (
    id: string,
    data: { action: 'APPROVE' | 'REJECT'; notes?: string; rejection_reason?: string }
  ) => api.post(`/admin/complaints/${id}/verify`, data),
  getDuplicates: () => api.get('/admin/duplicates'),
  mergeDuplicates: (data: { primary_id: string; duplicate_ids: string[] }) =>
    api.post('/admin/duplicates/merge', data),
  getAuditLogs: (limit?: number) => api.get('/admin/audit-logs', { params: { limit } }),
};
