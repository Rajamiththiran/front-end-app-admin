// src/pages/complaints/complaintDetails.jsx
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import SubjectIcon from "@mui/icons-material/Subject";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  dropComplaint,
  fetchComplaintById,
  resetCurrentComplaint,
} from "../../store/complaintSlice";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
import AssignComplaint from "../../components/complaints/assignComplaint";
import DashboardLayout from "../../components/layout/dashboardlayout";

import useAuth from "../../hooks/useAuth";
import { COMPLAINT_STATUS, ROUTES, STATUS_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";

const ComplaintDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Local state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
  });

  // Redux state
  const {
    current: { item: complaint, status, error },
    drop: { status: dropStatus, error: dropError },
  } = useSelector((state) => state.complaints);

  // Load complaint on mount
  useEffect(() => {
    dispatch(fetchComplaintById(id));

    // Cleanup on unmount
    return () => {
      dispatch(resetCurrentComplaint());
    };
  }, [dispatch, id]);

  // Handle back button
  const handleBack = () => {
    navigate(ROUTES.COMPLAINTS);
  };

  // Handle assign complaint
  const handleAssignClick = () => {
    setIsAssignModalOpen(true);
  };

  // Handle drop complaint
  const handleDropClick = () => {
    setIsDropModalOpen(true);
  };

  // Handle drop complaint submission
  const handleDropSubmit = async () => {
    if (!dropReason.trim()) return;

    try {
      await dispatch(
        dropComplaint({
          complaint_id: complaint.id,
          reason: dropReason,
        })
      ).unwrap();

      setDropReason("");
      setIsDropModalOpen(false);
      setSuccessAlert({
        open: true,
        message: "Complaint has been dropped successfully",
      });

      // Reload complaint to get updated status
      setTimeout(() => {
        dispatch(fetchComplaintById(id));
      }, 500);
    } catch (error) {
      console.error("Failed to drop complaint:", error);
    }
  };

  // Close success alert
  const handleCloseSuccessAlert = () => {
    setSuccessAlert({ open: false, message: "" });
  };

  // Handle successful assignment
  const handleAssignSuccess = () => {
    setIsAssignModalOpen(false);
    setSuccessAlert({
      open: true,
      message: "Complaint has been assigned successfully",
    });

    // Reload complaint to get updated status
    setTimeout(() => {
      dispatch(fetchComplaintById(id));
    }, 500);
  };

  // Render loading state
  if (status === "loading") {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <IconButton onClick={handleBack} className="mr-2">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" className="font-bold">
              Loading Complaint...
            </Typography>
          </Box>

          <Box className="flex justify-center items-center py-12">
            <Typography variant="body1">
              Loading complaint details...
            </Typography>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <IconButton onClick={handleBack} className="mr-2">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" className="font-bold">
              Error Loading Complaint
            </Typography>
          </Box>

          <Alert severity="error" title="Error" className="mb-4">
            {error}
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Back to Complaints
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  // Render complaint not found
  if (!complaint) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <IconButton onClick={handleBack} className="mr-2">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" className="font-bold">
              Complaint Not Found
            </Typography>
          </Box>

          <Alert severity="warning" title="Not Found" className="mb-4">
            The complaint you are looking for does not exist or has been
            deleted.
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Back to Complaints
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Success alert */}
        <Alert
          severity="success"
          isSnackbar
          open={successAlert.open}
          onClose={handleCloseSuccessAlert}
          autoHideDuration={5000}
        >
          {successAlert.message}
        </Alert>

        {/* Header section */}
        <Box className="flex items-center justify-between mb-6">
          <Box className="flex items-center">
            <IconButton onClick={handleBack} className="mr-2">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" className="font-bold">
                Complaint #{complaint.id}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {complaint.title}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center space-x-2">
            {complaint.status === COMPLAINT_STATUS.PENDING && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AssignmentIndIcon />}
                  onClick={handleAssignClick}
                >
                  Assign to Staff
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DoDisturbIcon />}
                  onClick={handleDropClick}
                >
                  Drop Complaint
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Status Chip */}
        <Box className="mb-6">
          <Chip
            label={complaint.status}
            className={`${
              STATUS_COLORS[complaint.status] || "bg-gray-100 text-gray-800"
            } px-3 py-1`}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Left column - Complaint details */}
          <Grid item xs={12} md={8}>
            <Card
              title="Complaint Details"
              titleIcon={<SubjectIcon />}
              className="mb-4"
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold mb-1"
                  >
                    Title
                  </Typography>
                  <Typography variant="body1">{complaint.title}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold mb-1"
                  >
                    Subject
                  </Typography>
                  <Typography variant="body1">{complaint.subject}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold mb-1"
                  >
                    Created On
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(complaint.created_at, "long")}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="font-semibold mb-1"
                  >
                    Description
                  </Typography>
                  <Typography variant="body1" className="whitespace-pre-line">
                    {complaint.body}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            {/* Response Section */}
            {complaint.response && (
              <Card
                title="Response"
                titleIcon={<SubjectIcon />}
                className="mb-4"
              >
                <Box>
                  <Typography variant="body1" className="whitespace-pre-line">
                    {complaint.response}
                  </Typography>
                </Box>

                {complaint.resolved_at && (
                  <Box className="mt-4 text-right">
                    <Typography variant="caption" color="textSecondary">
                      Resolved on {formatDate(complaint.resolved_at, "long")}
                    </Typography>
                  </Box>
                )}
              </Card>
            )}

            {/* Timeline Section */}
            <Card title="Complaint Timeline" titleIcon={<AccessTimeIcon />}>
              <Box className="border-l-2 border-gray-200 ml-3 pl-4">
                {/* Created */}
                <Box className="mb-4 relative">
                  <Box className="absolute w-3 h-3 bg-blue-500 rounded-full -left-6 mt-1.5"></Box>
                  <Typography variant="subtitle1" className="font-semibold">
                    Complaint Created
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(complaint.created_at, "full")}
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    Complaint was submitted by{" "}
                    {complaint.students?.name || "Unknown Student"}
                  </Typography>
                </Box>

                {/* Assigned */}
                {complaint.assigned_at && (
                  <Box className="mb-4 relative">
                    <Box className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-6 mt-1.5"></Box>
                    <Typography variant="subtitle1" className="font-semibold">
                      Complaint Assigned
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(complaint.assigned_at, "full")}
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      Assigned to {complaint.staffs?.name || "Unknown Staff"}
                    </Typography>
                  </Box>
                )}

                {/* Resolved */}
                {complaint.resolved_at && (
                  <Box className="relative">
                    <Box className="absolute w-3 h-3 bg-green-500 rounded-full -left-6 mt-1.5"></Box>
                    <Typography variant="subtitle1" className="font-semibold">
                      Complaint{" "}
                      {complaint.status === COMPLAINT_STATUS.COMPLETED
                        ? "Resolved"
                        : "Dropped"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(complaint.resolved_at, "full")}
                    </Typography>
                    {complaint.status === COMPLAINT_STATUS.COMPLETED && (
                      <Typography variant="body2" className="mt-1">
                        Resolved by {complaint.staffs?.name || "Unknown Staff"}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Right column - Student & Staff info */}
          <Grid item xs={12} md={4}>
            {/* Student Info */}
            <Card
              title="Student Information"
              titleIcon={<SchoolIcon />}
              className="mb-4"
            >
              <Box className="flex items-center mb-4">
                <Avatar className="bg-blue-500 mr-3">
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {complaint.students?.name || "Unknown Student"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {complaint.students?.id_no || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Divider className="mb-4" />

              <Box className="space-y-3">
                <Box className="flex items-center">
                  <EmailIcon className="text-gray-500 mr-2" fontSize="small" />
                  <Typography variant="body2">
                    {complaint.students?.email || "N/A"}
                  </Typography>
                </Box>

                <Box className="flex items-center">
                  <PhoneIcon className="text-gray-500 mr-2" fontSize="small" />
                  <Typography variant="body2">
                    {complaint.students?.mobile_no || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Staff Info - Show only if assigned */}
            {complaint.staffs && (
              <Card title="Assigned Staff" titleIcon={<PersonIcon />}>
                <Box className="flex items-center mb-4">
                  <Avatar className="bg-purple-500 mr-3">
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {complaint.staffs.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {complaint.staffs.department || "No Department"}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="mb-4" />

                <Box className="space-y-3">
                  <Box className="flex items-center">
                    <EmailIcon
                      className="text-gray-500 mr-2"
                      fontSize="small"
                    />
                    <Typography variant="body2">
                      {complaint.staffs.email}
                    </Typography>
                  </Box>

                  <Box className="flex items-center">
                    <PhoneIcon
                      className="text-gray-500 mr-2"
                      fontSize="small"
                    />
                    <Typography variant="body2">
                      {complaint.staffs.mobile_no}
                    </Typography>
                  </Box>

                  {complaint.staffs.specialization && (
                    <Box className="mt-2">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        Specialization
                      </Typography>
                      <Typography variant="body2">
                        {complaint.staffs.specialization}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Assign Complaint Modal */}
        <Modal
          open={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Complaint to Staff"
          size="md"
        >
          {complaint && (
            <AssignComplaint
              complaint={complaint}
              onSuccess={handleAssignSuccess}
              onCancel={() => setIsAssignModalOpen(false)}
            />
          )}
        </Modal>

        {/* Drop Complaint Modal */}
        <Modal
          open={isDropModalOpen}
          onClose={() => setIsDropModalOpen(false)}
          title="Drop Complaint"
          size="md"
          actions={
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setIsDropModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={!dropReason.trim() || dropStatus === "loading"}
                onClick={handleDropSubmit}
              >
                {dropStatus === "loading" ? "Processing..." : "Drop Complaint"}
              </Button>
            </>
          }
        >
          <Box>
            <Typography variant="body1" className="mb-4">
              Are you sure you want to drop this complaint? This action cannot
              be undone.
            </Typography>

            <TextField
              label="Reason for dropping"
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
              placeholder="Please provide a reason for dropping this complaint"
              error={!!dropError}
              helperText={dropError}
            />
          </Box>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ComplaintDetails;
