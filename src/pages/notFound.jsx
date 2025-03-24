// src/pages/notFound.jsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * 404 Not Found page
 * Displayed when a user navigates to a non-existent route
 */
const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Dashboard path to redirect to if authenticated
  const dashboardPath = "/dashboard";
  // Login path to redirect to if not authenticated
  const loginPath = "/login";

  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 100,
            color: "error.main",
            mb: 3,
          }}
        />

        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          paragraph
          textAlign="center"
          sx={{ maxWidth: 500, mb: 4 }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable. Please check the URL or
          navigate back to a known page.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Go Back
          </Button>

          <Button
            component={Link}
            to={isAuthenticated ? dashboardPath : loginPath}
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
          >
            {isAuthenticated ? "Back to Dashboard" : "Back to Login"}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="caption" color="textSecondary">
          &copy; {new Date().getFullYear()} Complaint Management System
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
