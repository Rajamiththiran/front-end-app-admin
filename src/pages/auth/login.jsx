// src/pages/auth/login.jsx
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../../components/auth/loginForm";
import Alert from "../../components/common/alert";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

/**
 * Login page component for admin authentication
 * Handles the first step of OTP-based login (email submission)
 */
const Login = () => {
  const {
    isAuthenticated,
    loading,
    initiateLogin,
    otpSent,
    otpEmail,
    otpSending,
    error,
    clearError,
    resetOtpState,
  } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  // Reset OTP state when component mounts
  useEffect(() => {
    // Ensure resetOtpState is called
    resetOtpState();
  }, [resetOtpState]);

  // Handle OTP send request
  const handleSendOtp = async (email) => {
    try {
      const success = await initiateLogin(email);

      if (success) {
        setAlertMessage("OTP sent successfully! Please check your email.");
        setAlertSeverity("success");
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage(err.message || "Failed to send OTP. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlertOpen(false);
    clearError();
  };

  // Redirect to dashboard if already authenticated - but only after loading completes
  if (isAuthenticated && !loading) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Redirect to OTP verification page if OTP is sent
  if (otpSent && otpEmail) {
    return <Navigate to={ROUTES.VERIFY_OTP} replace />;
  }

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex items-center justify-center py-12"
    >
      <Box className="w-full">
        {/* Logo/Brand */}
        <Box className="text-center mb-8">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-primary mb-2"
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Complaint Management System
          </Typography>
        </Box>

        {/* Error alert */}
        {error && (
          <Alert
            severity="error"
            title="Authentication Error"
            showCloseButton
            onClose={clearError}
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        {/* Success/info alert */}
        <Alert
          severity={alertSeverity}
          showCloseButton
          onClose={handleAlertClose}
          isSnackbar
          open={alertOpen}
          autoHideDuration={6000}
        >
          {alertMessage}
        </Alert>

        {/* Login form */}
        <LoginForm
          onSendOtp={handleSendOtp}
          loading={otpSending}
          error={error}
        />

        {/* Footer text */}
        <Box className="mt-8 text-center">
          <Typography variant="caption" color="textSecondary">
            &copy; {new Date().getFullYear()} Admin Portal • All rights reserved
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
