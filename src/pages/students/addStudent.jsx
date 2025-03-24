import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/common/alert";
import Input from "../../components/common/input";
import DashboardLayout from "../../components/layout/dashboardlayout";

// Import API service (to be implemented)
// import { createStudent } from '../services/api';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    id_no: "",
    date_of_birth: "",
    nic_no: "",
    image_url: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    is_active: true,
  });

  // Form errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile_no: "",
    id_no: "",
    date_of_birth: "",
    nic_no: "",
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle toggle switch change
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Required fields validation
    const requiredFields = [
      "name",
      "email",
      "mobile_no",
      "id_no",
      "date_of_birth",
      "nic_no",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Mobile number validation
    if (
      formData.mobile_no &&
      !/^\+?[0-9]{10,15}$/.test(formData.mobile_no.replace(/\s/g, ""))
    ) {
      newErrors.mobile_no = "Please enter a valid mobile number";
      isValid = false;
    }

    // Date of birth validation
    if (formData.date_of_birth) {
      const dobDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (isNaN(dobDate.getTime())) {
        newErrors.date_of_birth = "Please enter a valid date";
        isValid = false;
      } else if (dobDate > today) {
        newErrors.date_of_birth = "Date of birth cannot be in the future";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setAlertSeverity("error");
      setAlertMessage("Please fix the errors in the form before submitting.");
      setAlertOpen(true);
      return;
    }

    try {
      setLoading(true);

      // In real implementation, call API
      // await createStudent(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setAlertSeverity("success");
      setAlertMessage("Student created successfully!");
      setAlertOpen(true);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/students");
      }, 1500);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.message || "Failed to create student. Please try again."
      );
      setAlertOpen(true);
      setLoading(false);
    }
  };

  // Close alert
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <DashboardLayout>
      {/* Alert for success/error messages */}
      <Alert
        open={alertOpen}
        onClose={handleAlertClose}
        severity={alertSeverity}
        isSnackbar={true}
        autoHideDuration={5000}
      >
        {alertMessage}
      </Alert>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        className="mb-4"
      >
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
          Dashboard
        </Link>
        <Link to="/students" className="text-gray-500 hover:text-gray-700">
          Students
        </Link>
        <Typography color="textPrimary">Add New Student</Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box className="mb-6 flex justify-between items-center">
        <Typography variant="h4" className="font-bold">
          Add New Student
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/students"
        >
          Back to List
        </Button>
      </Box>

      {/* Form */}
      <Paper className="p-6">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-2">
                Basic Information
              </Typography>
              <Divider className="mb-4" />
            </Grid>

            {/* Name */}
            <Grid item xs={12} md={6}>
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={12} md={6}>
              <Input
                id="mobile_no"
                name="mobile_no"
                label="Mobile Number"
                value={formData.mobile_no}
                onChange={handleChange}
                required
                error={errors.mobile_no}
                helperText={
                  errors.mobile_no || "Include country code (e.g., +94)"
                }
              />
            </Grid>

            {/* ID Number */}
            <Grid item xs={12} md={6}>
              <Input
                id="id_no"
                name="id_no"
                label="Student ID Number"
                value={formData.id_no}
                onChange={handleChange}
                required
                error={errors.id_no}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} md={6}>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                error={errors.date_of_birth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* NIC */}
            <Grid item xs={12} md={6}>
              <Input
                id="nic_no"
                name="nic_no"
                label="NIC Number"
                value={formData.nic_no}
                onChange={handleChange}
                required
                error={errors.nic_no}
              />
            </Grid>

            {/* Address Section */}
            <Grid item xs={12} className="mt-4">
              <Typography variant="h6" className="font-semibold mb-2">
                Address Information (Optional)
              </Typography>
              <Divider className="mb-4" />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Input
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                multiline
                maxRows={3}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={4}>
              <Input
                id="city"
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            {/* State/Province */}
            <Grid item xs={12} md={4}>
              <Input
                id="state"
                name="state"
                label="State/Province"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>

            {/* ZIP/Postal Code */}
            <Grid item xs={12} md={4}>
              <Input
                id="zip"
                name="zip"
                label="ZIP/Postal Code"
                value={formData.zip}
                onChange={handleChange}
              />
            </Grid>

            {/* Status Section */}
            <Grid item xs={12} className="mt-4">
              <Typography variant="h6" className="font-semibold mb-2">
                Account Status
              </Typography>
              <Divider className="mb-4" />
            </Grid>

            {/* Active Status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label={formData.is_active ? "Active" : "Inactive"}
              />
              <FormHelperText>
                {formData.is_active
                  ? "Student will be able to log in and use the system."
                  : "Student will not be able to log in to the system."}
              </FormHelperText>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} className="mt-4">
              <Box className="flex justify-end">
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  className="mr-2"
                  disabled={loading}
                  onClick={() => navigate("/students")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                >
                  {loading ? "Saving..." : "Save Student"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </DashboardLayout>
  );
};

export default AddStudent;
