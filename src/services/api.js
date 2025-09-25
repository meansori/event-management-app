import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor dengan error handling yang lebih baik
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error);

    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error("Error Data:", error.response.data);
      console.error("Error Status:", error.response.status);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API functions dengan fallback data
export const dashboardAPI = {
  getStats: () => api.get("/dashboard"),
};

export const eventsAPI = {
  getAll: () => api.get("/events"),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const accountsAPI = {
  getAll: () => api.get("/accounts"),
  create: (data) => api.post("/accounts", data),
  update: (id, data) => api.patch(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

export const participantsAPI = {
  getAll: () => api.get("/participants"),
  create: (data) => api.post("/participants", data),
  update: (id, data) => api.patch(`/participants/${id}`, data),
  delete: (id) => api.delete(`/participants/${id}`),
};

export default api;
