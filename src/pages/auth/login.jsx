// src/pages/auth/login.jsx
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/loginForm";
import Alert from "../../components/common/alert";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

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

  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    resetOtpState(); // Reset OTP state on mount
  }, [resetOtpState]);

  // Redirect to VERIFY_OTP page if OTP is sent
  useEffect(() => {
    if (otpSent && otpEmail) {
      navigate(ROUTES.VERIFY_OTP, { replace: true });
    }
  }, [otpSent, otpEmail, navigate]);

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

  // Redirect to dashboard if authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex items-center justify-center py-12"
    >
      <Box className="w-full">
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

        <LoginForm
          onSendOtp={handleSendOtp}
          loading={otpSending}
          error={error}
        />

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
