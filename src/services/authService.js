// src/services/authService.js
import apiService from "../utils/axios";
import { API_ENDPOINTS, STORAGE_KEYS, USER_ROLES } from "../utils/constants";
import { clearUserData, saveUserData, setToken } from "../utils/helpers";

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
  /**
   * Send OTP for admin login
   * @param {string} email - Admin email address
   * @returns {Promise<Object>} Response object
   */
  adminSendOtp: (email) => {
    return apiService.post(API_ENDPOINTS.AUTH.ADMIN_SEND_OTP, {
      email,
    });
  },

  /**
   * Verify OTP for admin login
   * @param {string} email - Admin email address
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} User data with token
   */
  adminVerifyOtp: async (email, otp) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.ADMIN_CHECK_OTP, {
      email,
      otp,
    });

    // Save auth data to local storage
    if (response.token) {
      setToken(response.token);
      saveUserData({
        ...response,
        role: USER_ROLES.ADMIN,
      });
    }

    return response;
  },

  /**
   * Send OTP for staff login
   * @param {string} email - Staff email address
   * @returns {Promise<Object>} Response object
   */
  staffSendOtp: (email) => {
    return apiService.post(API_ENDPOINTS.AUTH.STAFF_SEND_OTP, {
      email,
    });
  },

  /**
   * Verify OTP for staff login
   * @param {string} email - Staff email address
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} User data with token
   */
  staffVerifyOtp: async (email, otp) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.STAFF_CHECK_OTP, {
      email,
      otp,
    });

    // Save auth data to local storage
    if (response.token) {
      setToken(response.token);
      saveUserData({
        ...response,
        role: USER_ROLES.STAFF,
      });
    }

    return response;
  },

  /**
   * Send OTP for student login
   * @param {string} email - Student email address
   * @returns {Promise<Object>} Response object
   */
  studentSendOtp: (email) => {
    return apiService.post(API_ENDPOINTS.AUTH.STUDENT_SEND_OTP, {
      email,
    });
  },

  /**
   * Verify OTP for student login
   * @param {string} email - Student email address
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} User data with token
   */
  studentVerifyOtp: async (email, otp) => {
    const response = await apiService.post(
      API_ENDPOINTS.AUTH.STUDENT_CHECK_OTP,
      {
        email,
        otp,
      }
    );

    // Save auth data to local storage
    if (response.token) {
      setToken(response.token);
      saveUserData({
        ...response,
        role: USER_ROLES.STUDENT,
      });
    }

    return response;
  },

  /**
   * Log out the current user
   */
  logout: () => {
    clearUserData();
    window.location.href = "/login";
  },
};

export default authService;
