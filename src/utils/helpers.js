// Import all required constants
import { STORAGE_KEYS, THEMES, USER_ROLES } from "./constants";

// Get authentication token from localStorage
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const debounce = (func, wait = 250, immediate = false) => {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);

    // Attach a cancel method to the returned function
    executedFunction.cancel = () => {
      clearTimeout(timeout);
      timeout = null;
    };

    return executedFunction;
  };
};

// Get user data from localStorage
export const getUserData = () => {
  const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userDataStr) return null;

  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

// Save user data to localStorage
export const saveUserData = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

// Clear user data from localStorage
export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken() && !!getUserData();
};

// Get current theme preference
export const getThemePreference = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
};

// Set theme preference
export const setThemePreference = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

// Check if user has admin role
export const isAdmin = () => {
  const userData = getUserData();
  return userData && userData.role === USER_ROLES.ADMIN;
};

// Get error message from API error
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || "An unexpected error occurred";
};
