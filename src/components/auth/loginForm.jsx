import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

/**
 * Login form component for admin authentication
 * Uses email-based OTP authentication
 * @param {Object} props - Component props
 * @param {function} props.onSendOtp - Function to handle OTP sending
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message if any
 */
const LoginForm = ({ onSendOtp, loading = false, error = "" }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Call the OTP send function
    onSendOtp(email);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "md",
        p: { xs: 3, sm: 4 },
        bgcolor: "#1f2937", // Dark background
        color: "white",
        borderRadius: 2,
      }}
      elevation={3}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1, color: "white" }}
        >
          Admin Login
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Enter your email to receive a one-time password
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiOutlinedInput-input": {
              color: "white",
            },
            "& .MuiFormHelperText-root": {
              color: "error.main",
            },
          }}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.5,
            bgcolor: "#3b82f6", // Blue button
            "&:hover": {
              bgcolor: "#2563eb",
            },
          }}
          endIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Complaint Management System Admin Panel
        </Typography>
      </Box>
    </Paper>
  );
};

LoginForm.propTypes = {
  onSendOtp: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;
