// src/services/complaintService.js
import apiService from "../utils/axios";
import { API_ENDPOINTS, PAGINATION } from "../utils/constants";

/**
 * Complaint service for handling complaint management operations
 */
const complaintService = {
  /**
   * Get all complaints with pagination and filters (for admin portal)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @param {number} params.student_id - Filter by student ID
   * @param {number} params.assigned_staff_id - Filter by assigned staff ID
   * @param {string} params.search - Search query
   * @returns {Promise<Object>} Paginated complaint list
   */
  getAllComplaints: (params = {}) => {
    const queryParams = {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      status: params.status || "",
      student_id: params.student_id || undefined,
      assigned_staff_id: params.assigned_staff_id || undefined,
      search: params.search || "",
    };

    return apiService.get(API_ENDPOINTS.ADMIN.COMPLAINTS, queryParams);
  },

  /**
   * Get complaint by ID (for admin portal)
   * @param {number} id - Complaint ID
   * @returns {Promise<Object>} Complaint details
   */
  getComplaintById: (id) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.COMPLAINT_DETAILS}/${id}`);
  },

  /**
   * Assign complaint to staff member (for admin portal)
   * @param {number} complaint_id - Complaint ID
   * @param {number} staff_id - Staff ID
   * @param {string} note - Optional assignment note
   * @returns {Promise<Object>} Response object
   */
  assignComplaint: (complaint_id, staff_id, note = "") => {
    return apiService.post(API_ENDPOINTS.ADMIN.ASSIGN_COMPLAINT, {
      complaint_id,
      staff_id,
      note,
    });
  },

  /**
   * Drop/Reject a complaint (for admin portal)
   * @param {number} complaint_id - Complaint ID
   * @param {string} reason - Reason for dropping
   * @returns {Promise<Object>} Response object
   */
  dropComplaint: (complaint_id, reason) => {
    return apiService.post(API_ENDPOINTS.ADMIN.DROP_COMPLAINT, {
      complaint_id,
      reason,
    });
  },

  /**
   * Get available staff for complaint assignment (for admin portal)
   * @returns {Promise<Array>} List of available staff
   */
  getAvailableStaff: () => {
    return apiService.get(API_ENDPOINTS.ADMIN.AVAILABLE_STAFF);
  },

  /**
   * Get complaint statistics for admin dashboard (for admin portal)
   * @returns {Promise<Object>} Complaint statistics
   */
  getComplaintStats: () => {
    return apiService.get(API_ENDPOINTS.ADMIN.COMPLAINT_STATS);
  },

  /**
   * Get all complaints assigned to the current staff (for staff portal)
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
   * Get complaint by ID for staff view (for staff portal)
   * @param {number} id - Complaint ID
   * @returns {Promise<Object>} Complaint details
   */
  getStaffComplaintById: (id) => {
    return apiService.get(`${API_ENDPOINTS.STAFF.COMPLAINT_DETAILS}/${id}`);
  },

  /**
   * Evaluate a complaint using ML model (for staff portal)
   * @param {number} complaint_id - Complaint ID
   * @returns {Promise<Object>} ML evaluation results
   */
  evaluateComplaint: (complaint_id) => {
    return apiService.post(API_ENDPOINTS.STAFF.EVALUATE_COMPLAINT, {
      complaint_id,
    });
  },

  /**
   * Update complaint with progress notes (for staff portal)
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
   * Mark complaint as complete with response (for staff portal)
   * @param {number} complaint_id - Complaint ID
   * @param {string} responseText - Resolution details
   * @returns {Promise<Object>} Response object
   */
  completeComplaint: (complaint_id, responseText) => {
    return apiService.post(API_ENDPOINTS.STAFF.COMPLETE_COMPLAINT, {
      complaint_id,
      response: responseText,
    });
  },

  /**
   * Get staff complaint statistics (for staff portal)
   * @returns {Promise<Object>} Complaint statistics
   */
  getStaffComplaintStats: () => {
    return apiService.get(API_ENDPOINTS.STAFF.COMPLAINT_STATS);
  },

  /**
   * Get all complaints for the current student (for student portal)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise<Object>} Paginated complaint list
   */
  getStudentComplaints: (params = {}) => {
    const queryParams = {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      status: params.status || "",
    };

    return apiService.get(API_ENDPOINTS.STUDENT.COMPLAINTS, queryParams);
  },

  /**
   * Get complaint by ID for student view (for student portal)
   * @param {number} id - Complaint ID
   * @returns {Promise<Object>} Complaint details
   */
  getStudentComplaintById: (id) => {
    return apiService.get(`${API_ENDPOINTS.STUDENT.COMPLAINT_DETAILS}/${id}`);
  },

  /**
   * Create a new complaint (for student portal)
   * @param {Object} complaintData - Complaint data
   * @param {string} complaintData.title - Complaint title
   * @param {string} complaintData.subject - Complaint subject
   * @param {string} complaintData.body - Complaint body/details
   * @returns {Promise<Object>} Created complaint
   */
  createComplaint: (complaintData) => {
    return apiService.post(API_ENDPOINTS.STUDENT.ADD_COMPLAINT, complaintData);
  },

  /**
   * Update an existing complaint (for student portal)
   * @param {Object} complaintData - Complaint data with ID
   * @param {number} complaintData.id - Complaint ID
   * @param {string} complaintData.title - Complaint title
   * @param {string} complaintData.subject - Complaint subject
   * @param {string} complaintData.body - Complaint body/details
   * @returns {Promise<Object>} Updated complaint
   */
  updateComplaint: (complaintData) => {
    return apiService.post(API_ENDPOINTS.STUDENT.EDIT_COMPLAINT, complaintData);
  },

  /**
   * Delete a complaint (for student portal)
   * @param {number} id - Complaint ID
   * @returns {Promise<Object>} Response object
   */
  deleteComplaint: (id) => {
    return apiService.post(API_ENDPOINTS.STUDENT.DELETE_COMPLAINT, { id });
  },
};

export default complaintService;
