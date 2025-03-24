// src/pages/auth/verifyOtp.jsx
import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import OtpVerification from "../../components/auth/otpVarification";
import Alert from "../../components/common/alert";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

/**
 * OTP verification page component for admin authentication
 * Handles the second step of OTP-based login (OTP verification)
 */
const VerifyOtp = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading,
    otpSent,
    otpEmail,
    verifying,
    initiateLogin,
    loginWithOtp,
    error,
    clearError,
    resetOtpState,
  } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [isResending, setIsResending] = useState(false);

  // Redirect to dashboard if already authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Redirect to login page if no OTP has been sent
  if (!otpSent || !otpEmail) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Handle OTP verification
  const handleVerifyOtp = async (email, otp) => {
    try {
      const success = await loginWithOtp(email, otp);

      if (!success) {
        setAlertMessage("Invalid OTP. Please try again.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage(err.message || "Verification failed. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async (email) => {
    setIsResending(true);

    try {
      const success = await initiateLogin(email);

      if (success) {
        setAlertMessage("OTP resent successfully! Please check your email.");
        setAlertSeverity("success");
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage(err.message || "Failed to resend OTP. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setIsResending(false);
    }
  };

  // Handle back button click
  const handleBackToLogin = () => {
    resetOtpState();
    navigate(ROUTES.LOGIN);
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlertOpen(false);
    clearError();
  };

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
            title="Verification Error"
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

        {/* OTP verification form */}
        <OtpVerification
          email={otpEmail}
          onVerifyOtp={(otp) => handleVerifyOtp(otpEmail, otp)}
          onResendOtp={() => handleResendOtp(otpEmail)}
          onBack={handleBackToLogin}
          loading={verifying}
          resending={isResending}
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

export default VerifyOtp;
