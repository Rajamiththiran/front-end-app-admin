import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { formatDate, formatPhoneNumber } from "../../utils/formatters";

/**
 * Staff details component for displaying staff information
 * @param {Object} props - Component props
 * @param {Object} props.staff - Staff data object
 * @param {boolean} props.loading - Whether the component is in loading state
 * @param {function} props.onEdit - Edit handler
 * @param {function} props.onActivate - Activate handler
 * @param {function} props.onDeactivate - Deactivate handler
 * @param {function} props.onDelete - Delete handler
 * @param {boolean} props.hideActions - Whether to hide action buttons
 */
const StaffDetails = ({
  staff,
  loading = false,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  hideActions = false,
}) => {
  if (!staff && !loading) {
    return (
      <Paper className="p-6 text-center">
        <Typography variant="h6" color="textSecondary">
          No staff data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="p-6">
      {/* Header with basic info */}
      <Box className="flex flex-col md:flex-row items-start md:items-center mb-6">
        <Avatar
          src={staff?.image_url || ""}
          alt={staff?.name || "Staff"}
          className="w-20 h-20 bg-blue-100 text-blue-600 mb-4 md:mb-0 md:mr-6"
        >
          {staff?.name?.charAt(0) || "S"}
        </Avatar>

        <Box className="flex-grow">
          <Box className="flex flex-col sm:flex-row justify-between">
            <Box>
              <Typography variant="h5" className="font-bold">
                {staff?.name || "Loading..."}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {staff?.id_no || "ID: N/A"}
              </Typography>

              <Box className="flex items-center">
                <Chip
                  label={staff?.is_active ? "Active" : "Inactive"}
                  color={staff?.is_active ? "success" : "error"}
                  size="small"
                  className="mr-2"
                />
                {staff?.department && (
                  <Chip
                    label={staff?.department}
                    color="primary"
                    size="small"
                    className="mr-2"
                  />
                )}
                {staff?.specialization && (
                  <Chip
                    label={staff?.specialization}
                    color="secondary"
                    size="small"
                  />
                )}
              </Box>
            </Box>

            {!hideActions && (
              <Box className="flex mt-3 sm:mt-0">
                {staff?.is_active ? (
                  <Button
                    color="error"
                    size="small"
                    variant="outlined"
                    onClick={onDeactivate}
                    className="mr-2"
                    disabled={loading}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    color="success"
                    size="small"
                    variant="outlined"
                    onClick={onActivate}
                    className="mr-2"
                    disabled={loading}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  onClick={onEdit}
                  disabled={loading}
                >
                  Edit
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Divider className="mb-6" />

      {/* Contact Information */}
      <Typography variant="h6" className="mb-4">
        Contact Information
      </Typography>
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <MailOutlineIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{staff?.email || "N/A"}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <PhoneIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Mobile Number
              </Typography>
              <Typography variant="body1">
                {staff?.mobile_no ? formatPhoneNumber(staff.mobile_no) : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <LocationOnIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Address
              </Typography>
              <Typography variant="body1">
                {[staff?.address, staff?.city, staff?.state, staff?.zip]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Personal Information */}
      <Typography variant="h6" className="mb-4">
        Personal Information
      </Typography>
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <SchoolIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                NIC Number
              </Typography>
              <Typography variant="body1">{staff?.nic_no || "N/A"}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <SchoolIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {staff?.date_of_birth
                  ? formatDate(staff.date_of_birth, "medium")
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <SchoolIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Department
              </Typography>
              <Typography variant="body1">
                {staff?.department || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box className="flex items-start">
            <SchoolIcon color="action" className="mr-2 mt-1" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Specialization
              </Typography>
              <Typography variant="body1">
                {staff?.specialization || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {!hideActions && (
        <>
          <Divider className="mb-6" />
          <Box className="flex justify-end">
            <Button
              color="error"
              variant="outlined"
              onClick={onDelete}
              disabled={loading}
            >
              Delete Staff
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

StaffDetails.propTypes = {
  staff: PropTypes.object,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onActivate: PropTypes.func,
  onDeactivate: PropTypes.func,
  onDelete: PropTypes.func,
  hideActions: PropTypes.bool,
};

export default StaffDetails;
