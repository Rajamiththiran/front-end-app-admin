// src/utils/axios.js
import axios from "axios";
import { clearUserData, getToken } from "./helpers";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        clearUserData();
        window.location.href = "/login";
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }

      // Handle server errors
      if (error.response.status >= 500) {
        return Promise.reject(
          new Error("Server error. Please try again later.")
        );
      }

      // Handle specific error messages from backend
      if (error.response.data && error.response.data.message) {
        return Promise.reject(new Error(error.response.data.message));
      }
    }

    // Network errors or request cancelled
    if (error.request && !error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Generic request methods
  async get(url, params = {}) {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  async post(url, data = {}) {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  async put(url, data = {}) {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  async delete(url, params = {}) {
    const response = await axiosInstance.delete(url, { params });
    return response.data;
  },

  // File upload with progress tracking
  async uploadFile(url, formData, onProgress) {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },
};

export default apiService;
