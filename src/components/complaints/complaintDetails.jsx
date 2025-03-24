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
  CircularProgress,
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
import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import Chip from "../../components/common/chip";
import Modal from "../../components/common/modal";
import AssignComplaint from "../../components/complaints/assignComplaint";
import DashboardLayout from "../../components/layout/dashboardlayout";
import useAuth from "../../hooks/useAuth";
import {
  dropComplaint,
  fetchComplaintById,
  resetCurrentComplaint,
  resetDropStatus,
} from "../../store/complaintSlice";
import { COMPLAINT_STATUS, ROUTES, STATUS_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";

/**
 * Complaint Details Page Component
 * Displays detailed information about a specific complaint
 */
const ComplaintDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Local state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Redux state
  const {
    current: { item: complaint, status, error },
    drop: { status: dropStatus, error: dropError, success: dropSuccess },
  } = useSelector((state) => state.complaints);

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Load complaint on mount
  useEffect(() => {
    dispatch(fetchComplaintById(id));

    // Cleanup on unmount
    return () => {
      dispatch(resetCurrentComplaint());
      dispatch(resetDropStatus());
    };
  }, [dispatch, id]);

  // Handle drop success/error
  useEffect(() => {
    if (dropSuccess) {
      setIsDropModalOpen(false);
      setAlertConfig({
        open: true,
        message: "Complaint has been dropped successfully",
        severity: "success",
      });
      // Refresh complaint details
      dispatch(fetchComplaintById(id));
    } else if (dropError) {
      setAlertConfig({
        open: true,
        message: dropError,
        severity: "error",
      });
    }
  }, [dropSuccess, dropError, dispatch, id]);

  // Handle navigation back to complaints list
  const handleBack = () => {
    navigate(ROUTES.COMPLAINTS);
  };

  // Handle complaint assignment
  const handleAssignClick = () => {
    setIsAssignModalOpen(true);
  };

  // Handle successful assignment
  const handleAssignSuccess = () => {
    setIsAssignModalOpen(false);
    setAlertConfig({
      open: true,
      message: "Complaint has been assigned successfully",
      severity: "success",
    });
    // Refresh complaint details
    dispatch(fetchComplaintById(id));
  };

  // Handle complaint drop
  const handleDropClick = () => {
    setIsDropModalOpen(true);
  };

  // Handle drop form submission
  const handleDropSubmit = () => {
    if (!dropReason.trim()) return;

    dispatch(
      dropComplaint({
        complaint_id: complaint.id,
        reason: dropReason,
      })
    );
  };

  // Close alerts
  const handleCloseAlert = () => {
    setAlertConfig({ ...alertConfig, open: false });
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
            <CircularProgress />
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

          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Complaints
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  // Render "not found" state
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

          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Complaints
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Success/Error Alert */}
        <Alert
          severity={alertConfig.severity}
          isSnackbar
          open={alertConfig.open}
          onClose={handleCloseAlert}
          autoHideDuration={6000}
        >
          {alertConfig.message}
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

          <Box className="flex space-x-2">
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
            color={
              complaint.status === COMPLAINT_STATUS.PENDING
                ? "warning"
                : complaint.status === COMPLAINT_STATUS.ASSIGNED
                ? "info"
                : complaint.status === COMPLAINT_STATUS.IN_PROGRESS
                ? "primary"
                : complaint.status === COMPLAINT_STATUS.COMPLETED
                ? "success"
                : "error"
            }
            size="medium"
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
                  <Paper variant="outlined" className="p-4 bg-gray-50">
                    <Typography variant="body1" className="whitespace-pre-line">
                      {complaint.body}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Card>

            {/* Response Section - Show only if there's a response */}
            {complaint.response && (
              <Card
                title="Response"
                titleIcon={<SubjectIcon />}
                className="mb-4"
              >
                <Box>
                  <Paper variant="outlined" className="p-4 bg-gray-50">
                    <Typography variant="body1" className="whitespace-pre-line">
                      {complaint.response}
                    </Typography>
                  </Paper>
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
              <Box className="border-l-2 border-gray-200 ml-3 pl-6 py-2">
                {/* Created */}
                <Box className="mb-6 relative">
                  <Box className="absolute w-4 h-4 bg-blue-500 rounded-full -left-8 mt-1.5 flex items-center justify-center">
                    <Box className="w-2 h-2 bg-white rounded-full"></Box>
                  </Box>
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

                {/* Assigned - Show only if complaint was assigned */}
                {complaint.assigned_at && (
                  <Box className="mb-6 relative">
                    <Box className="absolute w-4 h-4 bg-yellow-500 rounded-full -left-8 mt-1.5 flex items-center justify-center">
                      <Box className="w-2 h-2 bg-white rounded-full"></Box>
                    </Box>
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

                {/* In Progress - Show only if complaint is in progress */}
                {complaint.status === COMPLAINT_STATUS.IN_PROGRESS && (
                  <Box className="mb-6 relative">
                    <Box className="absolute w-4 h-4 bg-purple-500 rounded-full -left-8 mt-1.5 flex items-center justify-center">
                      <Box className="w-2 h-2 bg-white rounded-full"></Box>
                    </Box>
                    <Typography variant="subtitle1" className="font-semibold">
                      In Progress
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(complaint.updated_at, "full")}
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      Staff member is working on this complaint
                    </Typography>
                  </Box>
                )}

                {/* Resolved/Dropped - Show only if complaint is completed or dropped */}
                {(complaint.status === COMPLAINT_STATUS.COMPLETED ||
                  complaint.status === COMPLAINT_STATUS.DROPPED) &&
                  complaint.resolved_at && (
                    <Box className="relative">
                      <Box
                        className={`absolute w-4 h-4 ${
                          complaint.status === COMPLAINT_STATUS.COMPLETED
                            ? "bg-green-500"
                            : "bg-red-500"
                        } rounded-full -left-8 mt-1.5 flex items-center justify-center`}
                      >
                        <Box className="w-2 h-2 bg-white rounded-full"></Box>
                      </Box>
                      <Typography variant="subtitle1" className="font-semibold">
                        Complaint{" "}
                        {complaint.status === COMPLAINT_STATUS.COMPLETED
                          ? "Resolved"
                          : "Dropped"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(complaint.resolved_at, "full")}
                      </Typography>
                      {complaint.status === COMPLAINT_STATUS.COMPLETED ? (
                        <Typography variant="body2" className="mt-1">
                          Resolved by{" "}
                          {complaint.staffs?.name || "Unknown Staff"}
                        </Typography>
                      ) : (
                        <Typography variant="body2" className="mt-1">
                          Dropped by admin
                          {complaint.drop_reason &&
                            `: "${complaint.drop_reason}"`}
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
              {complaint.students ? (
                <>
                  <Box className="flex items-center mb-4">
                    <Avatar
                      src={complaint.students.image_url}
                      alt={complaint.students.name}
                      className="bg-blue-500 mr-3"
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {complaint.students.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: {complaint.students.id_no || "N/A"}
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
                        {complaint.students.email}
                      </Typography>
                    </Box>

                    <Box className="flex items-center">
                      <PhoneIcon
                        className="text-gray-500 mr-2"
                        fontSize="small"
                      />
                      <Typography variant="body2">
                        {complaint.students.mobile_no || "N/A"}
                      </Typography>
                    </Box>

                    <Box className="flex items-center">
                      <CalendarTodayIcon
                        className="text-gray-500 mr-2"
                        fontSize="small"
                      />
                      <Typography variant="body2">
                        Registered:{" "}
                        {formatDate(
                          complaint.students.created_at || new Date(),
                          "medium"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Student information not available
                </Typography>
              )}
            </Card>

            {/* Staff Info - Show only if assigned */}
            {complaint.staffs && (
              <Card title="Assigned Staff" titleIcon={<PersonIcon />}>
                <Box className="flex items-center mb-4">
                  <Avatar
                    src={complaint.staffs.image_url}
                    alt={complaint.staffs.name}
                    className="bg-purple-500 mr-3"
                  >
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
                      {complaint.staffs.mobile_no || "N/A"}
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
                disabled={dropStatus === "loading"}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDropSubmit}
                disabled={!dropReason.trim() || dropStatus === "loading"}
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
              error={dropError ? true : false}
              helperText={dropError}
            />
          </Box>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ComplaintDetails;
