// src/services/api.js
import authService from "./authService";
import complaintService from "./complaintService";
import staffService from "./staffService";
import studentService from "./studentService";

/**
 * Consolidated API service that combines all service modules
 * This provides a central access point for all API operations
 */
const apiService = {
  /**
   * Authentication services
   */
  auth: authService,

  /**
   * Staff management services
   */
  staff: staffService,

  /**
   * Student management services
   */
  student: studentService,

  /**
   * Complaint management services
   */
  complaint: complaintService,
};

export default apiService;
