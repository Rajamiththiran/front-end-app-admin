// Constants for storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme_preference", // Add this for theme persistence
};

// Routes for navigation
export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Student routes
  STUDENTS: "/students",
  ADD_STUDENT: "/students/add",
  EDIT_STUDENT: "/students/edit/:id",
  STUDENT_PROFILE: "/students/:id",

  // Staff routes
  STAFF: "/staff",
  ADD_STAFF: "/staff/add",
  EDIT_STAFF: "/staff/edit/:id",
  STAFF_PROFILE: "/staff/:id",

  // Complaint routes
  COMPLAINTS: "/complaints",
  COMPLAINT_ANALYTICS: "/complaints/analytics",
  COMPLAINT_DETAILS: "/complaints/:id",

  // Settings
  SETTINGS: "/settings",
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  STUDENT: "student",
};

// Theme modes
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const CHART_COLORS = {
  PRIMARY: "#1976d2",
  SECONDARY: "#dc2626",
  PENDING: "#facc15", // Yellow
  ASSIGNED: "#3b82f6", // Blue
  IN_PROGRESS: "#6366f1", // Indigo
  COMPLETED: "#22c55e", // Green
  DROPPED: "#ef4444", // Red
};

export const COMPLAINT_STATUS = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  DROPPED: "DROPPED",
};

export const STATUS_COLORS = {
  [COMPLAINT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [COMPLAINT_STATUS.ASSIGNED]: "bg-blue-100 text-blue-800",
  [COMPLAINT_STATUS.IN_PROGRESS]: "bg-indigo-100 text-indigo-800",
  [COMPLAINT_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [COMPLAINT_STATUS.DROPPED]: "bg-red-100 text-red-800",
};
// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

// API Endpoints (you might want to move these to a separate file)
export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_SEND_OTP: "/api/admin/auth/send-otp",
    ADMIN_CHECK_OTP: "/api/admin/auth/check-otp",
  },
  ADMIN: {
    // Complaints endpoints
    COMPLAINTS: "/api/admin/complaints/all",
    COMPLAINT_DETAILS: "/api/admin/complaints",
    AVAILABLE_STAFF: "/api/admin/complaints/staffs",
    ASSIGN_COMPLAINT: "/api/admin/complaints/assign",
    DROP_COMPLAINT: "/api/admin/complaints/drop",
    COMPLAINT_STATS: "/api/admin/complaints/stats",

    // Staff endpoints
    STAFF: "/api/admin/staffs/all",
    STAFF_DETAILS: "/api/admin/staffs",
    ADD_STAFF: "/api/admin/staffs/new",
    EDIT_STAFF: "/api/admin/staffs/edit",
    DELETE_STAFF: "/api/admin/staffs/delete",
    ACTIVATE_STAFF: "/api/admin/staffs/activate",
    DEACTIVATE_STAFF: "/api/admin/staffs/deactivate",

    // Student endpoints
    STUDENTS: "/api/admin/students/all",
    STUDENT_DETAILS: "/api/admin/students",
    ADD_STUDENT: "/api/admin/students/new",
    EDIT_STUDENT: "/api/admin/students/edit",
    DELETE_STUDENT: "/api/admin/students/delete",
    ACTIVATE_STUDENT: "/api/admin/students/activate",
    DEACTIVATE_STUDENT: "/api/admin/students/deactivate",
  },
};
