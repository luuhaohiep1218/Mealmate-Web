import axios from "axios";
import { message } from "antd";

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("token");

    // If token exists, add it to request headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      const isLoginRequest =
        error.config.url.includes("/auth/user/login") ||
        error.config.url.includes("/auth/admin/login");

      switch (error.response.status) {
        case 400:
          message.error(
            errorMessage || "Bad request. Please check your input."
          );
          break;
        case 401:
          // Only redirect to login if it's not a login request and there's a token
          if (!isLoginRequest && sessionStorage.getItem("token")) {
            message.error("Session expired. Please login again.");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userInfo");
            window.location.href = "/";
          }
          break;
        case 403:
          message.error(
            errorMessage || "Forbidden. You do not have permission."
          );
          break;
        case 404:
          message.error(errorMessage || "Resource not found.");
          break;
        case 500:
          message.error(
            errorMessage || "Server error. Please try again later."
          );
          break;
        default:
          message.error(errorMessage || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      message.error("No response from server. Please check your connection.");
    } else {
      message.error("Error in making request. Please try again.");
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    userLogin: "/auth/user/login",
    adminLogin: "/auth/admin/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    google: "/auth/google",
    googleCallback: "/auth/google/callback",
  },
  user: {
    profile: "/users/profile",
    updateProfile: "/users/update-profile",
    changePassword: "/users/change-password",
  },
  upload: "/upload",
  recipes: {
    list: "/recipes",
    detail: (id) => `/recipes/${id}`,
    create: "/recipes",
    update: (id) => `/recipes/${id}`,
    delete: (id) => `/recipes/${id}`,
    deleteMany: "/recipes",
  },
  menus: {
    list: "/menus",
    detail: (id) => `/menus/${id}`,
    create: "/menus",
    update: (id) => `/menus/${id}`,
    delete: (id) => `/menus/${id}`,
    deleteMany: "/menus",
  },
};

// Helper functions for common API calls
export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  patch: (url, data = {}, config = {}) =>
    axiosInstance.patch(url, data, config),
};

export default axiosInstance;
