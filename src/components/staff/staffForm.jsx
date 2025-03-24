import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  isValidEmail,
  isValidNIC,
  isValidPhoneNumber,
} from "../../utils/validators";

/**
 * Staff form component for creating or editing staff
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {boolean} props.isEdit - Whether this is an edit form
 * @param {function} props.onSubmit - Submit handler
 * @param {function} props.onCancel - Cancel handler
 * @param {boolean} props.loading - Whether the form is in loading state
 */
const StaffForm = ({
  initialData = {},
  isEdit = false,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    email: "",
    id_no: "",
    date_of_birth: "",
    nic_no: "",
    department: "",
    specialization: "",
    image_url: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    is_active: true,
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "name",
      "mobile_no",
      "email",
      "id_no",
      "date_of_birth",
      "nic_no",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.mobile_no && !isValidPhoneNumber(formData.mobile_no)) {
      newErrors.mobile_no = "Please enter a valid phone number";
    }

    // NIC validation
    if (formData.nic_no && !isValidNIC(formData.nic_no)) {
      newErrors.nic_no = "Please enter a valid NIC number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="p-4">
        <Typography variant="h6" className="mb-4">
          {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-medium mb-2">
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              required
              InputProps={{
                startAdornment: <PersonIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Staff ID Number"
              name="id_no"
              value={formData.id_no}
              onChange={handleChange}
              error={!!errors.id_no}
              helperText={errors.id_no}
              disabled={loading}
              required
              InputProps={{
                startAdornment: <SchoolIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              required
              InputProps={{
                startAdornment: <EmailIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleChange}
              error={!!errors.mobile_no}
              helperText={errors.mobile_no}
              disabled={loading}
              required
              InputProps={{
                startAdornment: <PhoneIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth}
              disabled={loading}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <CalendarTodayIcon color="action" className="mr-2" />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="NIC Number"
              name="nic_no"
              value={formData.nic_no}
              onChange={handleChange}
              error={!!errors.nic_no}
              helperText={errors.nic_no}
              disabled={loading}
              required
              InputProps={{
                startAdornment: <PersonIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          {/* Department Information */}
          <Grid item xs={12} className="mt-4">
            <Typography variant="subtitle1" className="font-medium mb-2">
              Department Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={!!errors.department}
              helperText={errors.department}
              disabled={loading}
              InputProps={{
                startAdornment: <WorkIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              error={!!errors.specialization}
              helperText={errors.specialization}
              disabled={loading}
              InputProps={{
                startAdornment: <SchoolIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} className="mt-4">
            <Typography variant="subtitle1" className="font-medium mb-2">
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              disabled={loading}
              InputProps={{
                startAdornment: <HomeIcon color="action" className="mr-2" />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <LocationCityIcon color="action" className="mr-2" />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <LocationCityIcon color="action" className="mr-2" />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              error={!!errors.zip}
              helperText={errors.zip}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <LocationCityIcon color="action" className="mr-2" />
                ),
              }}
            />
          </Grid>

          {/* Profile Image URL */}
          <Grid item xs={12} className="mt-4">
            <Typography variant="subtitle1" className="font-medium mb-2">
              Profile Image
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Profile Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              error={!!errors.image_url}
              helperText={errors.image_url}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} className="mt-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_active}
                  onChange={handleChange}
                  name="is_active"
                  color="primary"
                  disabled={loading}
                />
              }
              label="Active Staff Member"
            />
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Box className="flex justify-end mt-6 space-x-2">
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {isEdit ? "Update Staff" : "Create Staff"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

StaffForm.propTypes = {
  initialData: PropTypes.object,
  isEdit: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default StaffForm;
