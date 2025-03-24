// src/services/staffService.js
import apiService from "../utils/axios";
import { API_ENDPOINTS, PAGINATION } from "../utils/constants";

/**
 * Staff service for handling staff management operations
 */
const staffService = {
  /**
   * Get all staff members with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {number} params.is_active - Filter by active status (-1: all, 0: inactive, 1: active)
   * @returns {Promise<Object>} Paginated staff list
   */
  getAllStaff: (params = {}) => {
    const queryParams = {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      search: params.search || "",
      is_active: params.is_active !== undefined ? params.is_active : -1,
    };

    return apiService.get(API_ENDPOINTS.ADMIN.STAFF, queryParams);
  },

  /**
   * Get staff member by ID
   * @param {number} id - Staff ID
   * @returns {Promise<Object>} Staff details
   */
  getStaffById: (id) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.STAFF_DETAILS}/${id}`);
  },

  /**
   * Create a new staff member
   * @param {Object} staffData - Staff data
   * @returns {Promise<Object>} Created staff
   */
  createStaff: (staffData) => {
    return apiService.post(API_ENDPOINTS.ADMIN.ADD_STAFF, staffData);
  },

  /**
   * Update an existing staff member
   * @param {Object} staffData - Staff data with ID
   * @returns {Promise<Object>} Updated staff
   */
  updateStaff: (staffData) => {
    return apiService.post(API_ENDPOINTS.ADMIN.EDIT_STAFF, staffData);
  },

  /**
   * Delete a staff member
   * @param {number} id - Staff ID
   * @returns {Promise<Object>} Response object
   */
  deleteStaff: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.DELETE_STAFF, { id });
  },

  /**
   * Activate a staff member
   * @param {number} id - Staff ID
   * @returns {Promise<Object>} Response object
   */
  activateStaff: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.ACTIVATE_STAFF, { id });
  },

  /**
   * Deactivate a staff member
   * @param {number} id - Staff ID
   * @returns {Promise<Object>} Response object
   */
  deactivateStaff: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.DEACTIVATE_STAFF, { id });
  },

  /**
   * Get complaints assigned to a staff member (for staff portal)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search query
   * @returns {Promise<Object>} Paginated complaint list
   */
  getStaffComplaints: (params = {}) => {
    const queryParams = {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      status: params.status || "",
      search: params.search || "",
    };

    return apiService.get(API_ENDPOINTS.STAFF.COMPLAINTS, queryParams);
  },

  /**
   * Get a specific complaint assigned to a staff member
   * @param {number} id - Complaint ID
   * @returns {Promise<Object>} Complaint details
   */
  getStaffComplaintById: (id) => {
    return apiService.get(`${API_ENDPOINTS.STAFF.COMPLAINT_DETAILS}/${id}`);
  },

  /**
   * Evaluate a complaint using ML (for staff portal)
   * @param {number} complaint_id - Complaint ID
   * @returns {Promise<Object>} Evaluation results
   */
  evaluateComplaint: (complaint_id) => {
    return apiService.post(API_ENDPOINTS.STAFF.EVALUATE_COMPLAINT, {
      complaint_id,
    });
  },

  /**
   * Update a complaint with progress notes (for staff portal)
   * @param {number} complaint_id - Complaint ID
   * @param {string} notes - Progress notes
   * @returns {Promise<Object>} Response object
   */
  updateComplaintProgress: (complaint_id, notes) => {
    return apiService.post(API_ENDPOINTS.STAFF.UPDATE_COMPLAINT, {
      complaint_id,
      notes,
    });
  },

  /**
   * Mark a complaint as complete with response (for staff portal)
   * @param {number} complaint_id - Complaint ID
   * @param {string} response - Resolution details
   * @returns {Promise<Object>} Response object
   */
  completeComplaint: (complaint_id, responseText) => {
    return apiService.post(API_ENDPOINTS.STAFF.COMPLETE_COMPLAINT, {
      complaint_id,
      response: responseText,
    });
  },

  /**
   * Get complaint statistics for staff dashboard (for staff portal)
   * @returns {Promise<Object>} Complaint statistics
   */
  getStaffComplaintStats: () => {
    return apiService.get(API_ENDPOINTS.STAFF.COMPLAINT_STATS);
  },
};

export default staffService;
