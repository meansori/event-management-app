import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk handle response structure
api.interceptors.response.use(
  (response) => {
    // Pastikan response memiliki structure yang konsisten
    if (response.data && typeof response.data.success === "undefined") {
      response.data = {
        success: true,
        data: response.data,
      };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem("authToken");
      // localStorage.removeItem("user");
      // window.location.href = "/#home";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  verifyToken: () => api.get("/auth/verify"),
};

// Existing APIs...
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
