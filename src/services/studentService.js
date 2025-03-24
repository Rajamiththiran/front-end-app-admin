// src/services/studentService.js
import apiService from "../utils/axios";
import { API_ENDPOINTS, PAGINATION } from "../utils/constants";

/**
 * Student service for handling student management operations
 */
const studentService = {
  /**
   * Get all students with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {number} params.is_active - Filter by active status (-1: all, 0: inactive, 1: active)
   * @returns {Promise<Object>} Paginated student list
   */
  getAllStudents: (params = {}) => {
    const queryParams = {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      search: params.search || "",
      is_active: params.is_active !== undefined ? params.is_active : -1,
    };

    return apiService.get(API_ENDPOINTS.ADMIN.STUDENTS, queryParams);
  },

  /**
   * Get student by ID
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Student details
   */
  getStudentById: (id) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.STUDENT_DETAILS}/${id}`);
  },

  /**
   * Create a new student
   * @param {Object} studentData - Student data
   * @returns {Promise<Object>} Created student
   */
  createStudent: (studentData) => {
    return apiService.post(API_ENDPOINTS.ADMIN.ADD_STUDENT, studentData);
  },

  /**
   * Update an existing student
   * @param {Object} studentData - Student data with ID
   * @returns {Promise<Object>} Updated student
   */
  updateStudent: (studentData) => {
    return apiService.post(API_ENDPOINTS.ADMIN.EDIT_STUDENT, studentData);
  },

  /**
   * Delete a student
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Response object
   */
  deleteStudent: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.DELETE_STUDENT, { id });
  },

  /**
   * Activate a student
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Response object
   */
  activateStudent: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.ACTIVATE_STUDENT, { id });
  },

  /**
   * Deactivate a student
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Response object
   */
  deactivateStudent: (id) => {
    return apiService.post(API_ENDPOINTS.ADMIN.DEACTIVATE_STUDENT, { id });
  },

  /**
   * Get complaints submitted by a student (for student portal)
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
   * Get a specific complaint submitted by a student
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
   * @param {string} complaintData.body - Complaint body text
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
   * @param {string} complaintData.body - Complaint body text
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

export default studentService;
