// src/pages/staff/editStaff.jsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchStaffById,
  resetCurrentStaff,
  resetFormStatus,
  updateStaff,
} from "../../store/staffSlice";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import DashboardLayout from "../../components/layout/dashboardlayout";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import {
  isValidEmail,
  isValidNIC,
  isValidPhoneNumber,
} from "../../utils/validators";

const EditStaff = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Redux state
  const {
    current: { item: staffData, status: fetchStatus, error: fetchError },
    form: { status: submitStatus, error: submitError, success },
  } = useSelector((state) => state.staff);

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    mobile_no: "",
    id_no: "",
    date_of_birth: "",
    nic_no: "",
    department: "",
    specialization: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    is_active: true,
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch staff data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchStaffById(id));
    }

    // Reset state when component unmounts
    return () => {
      dispatch(resetFormStatus());
      dispatch(resetCurrentStaff());
    };
  }, [dispatch, id]);

  // Set form data when staff data is fetched
  useEffect(() => {
    if (staffData) {
      setFormData({
        id: staffData.id,
        name: staffData.name || "",
        email: staffData.email || "",
        mobile_no: staffData.mobile_no || "",
        id_no: staffData.id_no || "",
        date_of_birth: staffData.date_of_birth || "",
        nic_no: staffData.nic_no || "",
        department: staffData.department || "",
        specialization: staffData.specialization || "",
        address: staffData.address || "",
        city: staffData.city || "",
        state: staffData.state || "",
        zip: staffData.zip || "",
        is_active: staffData.is_active || false,
      });
    }
  }, [staffData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field is a checkbox, use checked property
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // Required fields
    const requiredFields = [
      "name",
      "email",
      "mobile_no",
      "id_no",
      "date_of_birth",
      "nic_no",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (formData.mobile_no && !isValidPhoneNumber(formData.mobile_no)) {
      errors.mobile_no = "Please enter a valid phone number";
    }

    // NIC validation
    if (formData.nic_no && !isValidNIC(formData.nic_no)) {
      errors.nic_no = "Please enter a valid NIC number";
    }

    // Date of birth validation
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        errors.date_of_birth = "Please enter a valid date";
      } else if (birthDate > today) {
        errors.date_of_birth = "Date of birth cannot be in the future";
      } else if (today.getFullYear() - birthDate.getFullYear() < 18) {
        errors.date_of_birth = "Staff must be at least 18 years old";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch action to update staff
      await dispatch(updateStaff(formData)).unwrap();

      // Success message is shown via Redux state
      // Will navigate back after a short delay
      setTimeout(() => {
        navigate(ROUTES.STAFF);
      }, 2000);
    } catch (err) {
      // Error is handled by Redux
      console.error("Failed to update staff:", err);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(ROUTES.STAFF);
  };

  // Show loading state while fetching staff data
  if (fetchStatus === "loading") {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center justify-center" sx={{ py: 8 }}>
            <CircularProgress />
            <Typography variant="h6" className="ml-3">
              Loading staff information...
            </Typography>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  // Show error if staff data couldn't be fetched
  if (fetchError) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              className="mr-4"
            >
              Back to Staff List
            </Button>
            <Typography variant="h4" component="h1" className="font-bold">
              Error Loading Staff
            </Typography>
          </Box>

          <Alert severity="error" title="Error" className="mb-4">
            {fetchError}
          </Alert>

          <Button variant="contained" onClick={handleCancel}>
            Return to Staff List
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box className="flex items-center mb-6">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            className="mr-4"
          >
            Back to Staff List
          </Button>
          <Box>
            <Typography variant="h4" component="h1" className="font-bold">
              Edit Staff Member
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Update information for {staffData?.name || "staff member"}
            </Typography>
          </Box>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" title="Success" className="mb-4">
            Staff information has been updated successfully.
          </Alert>
        )}

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" title="Error" className="mb-4">
            {submitError}
          </Alert>
        )}

        {/* Staff Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} lg={8}>
              <Card
                title="Personal Information"
                titleIcon={<PersonIcon />}
                className="mb-4"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!validationErrors.email}
                      helperText={validationErrors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mobile Number"
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!validationErrors.mobile_no}
                      helperText={validationErrors.mobile_no}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Staff ID Number"
                      name="id_no"
                      value={formData.id_no}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!validationErrors.id_no}
                      helperText={validationErrors.id_no}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="NIC Number"
                      name="nic_no"
                      value={formData.nic_no}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!validationErrors.nic_no}
                      helperText={validationErrors.nic_no}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!validationErrors.date_of_birth}
                      helperText={validationErrors.date_of_birth}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_active}
                          onChange={handleChange}
                          name="is_active"
                          color="primary"
                        />
                      }
                      label="Active Account"
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Professional Information */}
              <Card title="Professional Information" className="mb-4">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Address Information */}
              <Card title="Address Information">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Postal Code"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right Column - Form Actions */}
            <Grid item xs={12} lg={4}>
              <Card title="Actions">
                <Box className="space-y-4">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-4"
                  >
                    Please review all information before submitting. Fields
                    marked with * are required.
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<SaveIcon />}
                    disabled={submitStatus === "loading"}
                    className="mb-3"
                  >
                    {submitStatus === "loading" ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    fullWidth
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={submitStatus === "loading"}
                  >
                    Cancel
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </DashboardLayout>
  );
};

export default EditStaff;
