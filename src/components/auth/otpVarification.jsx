import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

/**
 * OTP verification component for admin authentication
 * @param {Object} props - Component props
 * @param {string} props.email - Email address where OTP was sent
 * @param {function} props.onVerifyOtp - Function to handle OTP verification
 * @param {function} props.onResendOtp - Function to handle OTP resend
 * @param {function} props.onBack - Function to go back to email input
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.resending - Resending OTP state
 * @param {string} props.error - Error message if any
 */
const OtpVerification = ({
  email,
  onVerifyOtp,
  onResendOtp,
  onBack,
  loading = false,
  resending = false,
  error = "",
}) => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes countdown
  const timerRef = useRef(null);

  // Start the countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format remaining time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset timer when OTP is resent
  const handleResendOtp = () => {
    setRemainingTime(300);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    onResendOtp(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error
    setOtpError("");

    // Validate OTP
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (otp.length < 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    // Call the OTP verification function
    onVerifyOtp(email, otp);
  };

  return (
    <Paper elevation={3} className="w-full max-w-md p-6 sm:p-8">
      <Box className="text-center mb-6">
        <Typography variant="h5" component="h1" className="font-bold mb-2">
          Verify OTP
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="6-Digit OTP"
          type="text"
          variant="outlined"
          fullWidth
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
          }
          error={!!otpError}
          helperText={otpError}
          className="mb-4"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box className="flex justify-between items-center mb-4">
          <Typography
            variant="body2"
            color={remainingTime > 0 ? "textSecondary" : "error"}
          >
            {remainingTime > 0
              ? `OTP expires in ${formatTime(remainingTime)}`
              : "OTP has expired"}
          </Typography>

          <Button
            variant="text"
            color="primary"
            disabled={resending || remainingTime > 270} // Disable for first 30 seconds
            onClick={handleResendOtp}
            size="small"
          >
            {resending ? (
              <>
                <CircularProgress size={16} color="inherit" className="mr-2" />
                Resending...
              </>
            ) : (
              "Resend OTP"
            )}
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || remainingTime === 0}
          className="mt-2"
          endIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LoginIcon />
            )
          }
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          size="large"
          onClick={onBack}
          disabled={loading}
          className="mt-3"
          startIcon={<ArrowBackIcon />}
        >
          Back to Login
        </Button>
      </form>

      <Box className="mt-6 text-center">
        <Typography variant="body2" color="textSecondary">
          Complaint Management System Admin Panel
        </Typography>
      </Box>
    </Paper>
  );
};

OtpVerification.propTypes = {
  email: PropTypes.string.isRequired,
  onVerifyOtp: PropTypes.func.isRequired,
  onResendOtp: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  resending: PropTypes.bool,
  error: PropTypes.string,
};

export default OtpVerification;
