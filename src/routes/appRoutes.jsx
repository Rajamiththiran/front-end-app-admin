import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingScreen from "../components/common/loadingScreen";
import { useAuth } from "../context/authContext";
import ProtectedRoute from "../routes/protectedRoute";
import PublicRoute from "../routes/publicRoutes";

// Import pages
import LoginPage from "../pages/auth/login";
import VerifyOtpPage from "../pages/auth/verifyOtp";
import ComplaintAnalyticsPage from "../pages/complaints/complaintAnalytic";
import ComplaintDetailsPage from "../pages/complaints/complaintDetails";
import ComplaintsPage from "../pages/complaints/complaints";
import DashboardPage from "../pages/dashboard/dashboard";
import NotFoundPage from "../pages/notFound";
import SettingsPage from "../pages/settings/settings";
import AddStaffPage from "../pages/staff/addStaff";
import EditStaffPage from "../pages/staff/editStaff";
import StaffListPage from "../pages/staff/staff";
import StaffProfilePage from "../pages/staff/staffProfile";
import AddStudentPage from "../pages/students/addStudent";
import EditStudentPage from "../pages/students/editStudent";
import StudentProfilePage from "../pages/students/studentProfile";
import StudentListPage from "../pages/students/students";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffListPage />} />
        <Route path="/staff/add" element={<AddStaffPage />} />
        <Route path="/staff/edit/:id" element={<EditStaffPage />} />
        <Route path="/staff/:id" element={<StaffProfilePage />} />

        {/* Student Routes */}
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/add" element={<AddStudentPage />} />
        <Route path="/students/edit/:id" element={<EditStudentPage />} />
        <Route path="/students/:id" element={<StudentProfilePage />} />

        {/* Complaint Routes - ORDER MATTERS! */}
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route
          path="/complaints/analytics"
          element={<ComplaintAnalyticsPage />}
        />
        <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
