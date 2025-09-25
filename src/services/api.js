import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dashboard - PERBAIKI ENDPOINT
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/event-stats"),
};

// Events - ENDPOINT SUDAH BENAR
export const eventsAPI = {
  getAll: () => api.get("/events"),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Accounts - ENDPOINT SUDAH BENAR
export const accountsAPI = {
  getAll: () => api.get("/accounts"),
  create: (data) => api.post("/accounts", data),
  update: (id, data) => api.patch(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// Participants - PERBAIKI ENDPOINT (dari participant-categories ke participants)
export const participantsAPI = {
  getAll: () => api.get("/participants"),
  create: (data) => api.post("/participants", data),
  update: (id, data) => api.patch(`/participants/${id}`, data),
  delete: (id) => api.delete(`/participants/${id}`),
};

// Participant Categories - TAMBAHKAN JIKA DIBUTUHKAN
export const participantCategoriesAPI = {
  getAll: () => api.get("/participant-categories"),
  create: (data) => api.post("/participant-categories", data),
  update: (id, data) => api.patch(`/participant-categories/${id}`, data),
  delete: (id) => api.delete(`/participant-categories/${id}`),
};

// Attendance
export const attendanceAPI = {
  getAll: () => api.get("/attendance"),
};

// Interceptor untuk request
api.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Request Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor untuk response
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    console.log("📨 Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export default api;
