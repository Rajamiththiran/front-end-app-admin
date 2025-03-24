// src/pages/staff/staffProfile.jsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WorkIcon from "@mui/icons-material/Work";
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
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  activateStaff,
  deactivateStaff,
  deleteStaff,
  fetchStaffById,
  resetActivationStatus,
  resetCurrentStaff,
  resetDeleteStatus,
} from "../../store/staffSlice";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
import Pagination from "../../components/common/pagination";
import Table from "../../components/common/table";
import DashboardLayout from "../../components/layout/dashboardlayout";

import useAuth from "../../hooks/useAuth";
import { PAGINATION, ROUTES } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const StaffProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Redux state
  const {
    current: { item: staff, status, error },
    delete: {
      status: deleteStatus,
      success: deleteSuccess,
      error: deleteError,
    },
    activate: {
      status: activateStatus,
      success: activateSuccess,
      error: activateError,
    },
    deactivate: {
      status: deactivateStatus,
      success: deactivateSuccess,
      error: deactivateError,
    },
  } = useSelector((state) => state.staff);

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Mock data for assigned complaints
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [complaintPagination, setComplaintPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

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
      dispatch(resetDeleteStatus());
      dispatch(resetActivationStatus());
      dispatch(resetCurrentStaff());
    };
  }, [dispatch, id]);

  // Mock fetch assigned complaints data
  useEffect(() => {
    if (staff) {
      // In a real implementation, this would be an API call
      // to fetch complaints assigned to this staff member
      const mockComplaints = [
        {
          id: 1,
          title: "Course Material Issue",
          subject: "Missing Lecture Notes",
          status: "IN_PROGRESS",
          created_at: "2025-03-15T10:30:00Z",
          student: { name: "John Smith" },
        },
        {
          id: 2,
          title: "Library Access Problem",
          subject: "Unable to access digital library",
          status: "COMPLETED",
          created_at: "2025-03-10T14:20:00Z",
          student: { name: "Jane Doe" },
        },
        {
          id: 3,
          title: "Wi-Fi Connectivity Issue",
          subject: "Poor connection in dormitory",
          status: "ASSIGNED",
          created_at: "2025-03-18T09:15:00Z",
          student: { name: "Michael Johnson" },
        },
      ];

      setAssignedComplaints(mockComplaints);
      setComplaintPagination({
        ...complaintPagination,
        total: mockComplaints.length,
        totalPages: Math.ceil(
          mockComplaints.length / complaintPagination.limit
        ),
      });
    }
  }, [staff]);

  // Show alerts when operations complete
  useEffect(() => {
    if (deleteSuccess) {
      setAlertConfig({
        open: true,
        message: "Staff member has been deleted successfully.",
        severity: "success",
      });
      setIsDeleteModalOpen(false);

      // Navigate back to staff list after a short delay
      setTimeout(() => {
        navigate(ROUTES.STAFF);
      }, 2000);

      dispatch(resetDeleteStatus());
    } else if (deleteError) {
      setAlertConfig({
        open: true,
        message: deleteError,
        severity: "error",
      });
      dispatch(resetDeleteStatus());
    }

    if (activateSuccess) {
      setAlertConfig({
        open: true,
        message: "Staff member has been activated successfully.",
        severity: "success",
      });
      setIsStatusModalOpen(false);
      dispatch(fetchStaffById(id)); // Refresh staff data
      dispatch(resetActivationStatus());
    } else if (activateError) {
      setAlertConfig({
        open: true,
        message: activateError,
        severity: "error",
      });
      dispatch(resetActivationStatus());
    }

    if (deactivateSuccess) {
      setAlertConfig({
        open: true,
        message: "Staff member has been deactivated successfully.",
        severity: "success",
      });
      setIsStatusModalOpen(false);
      dispatch(fetchStaffById(id)); // Refresh staff data
      dispatch(resetActivationStatus());
    } else if (deactivateError) {
      setAlertConfig({
        open: true,
        message: deactivateError,
        severity: "error",
      });
      dispatch(resetActivationStatus());
    }
  }, [
    deleteSuccess,
    deleteError,
    activateSuccess,
    activateError,
    deactivateSuccess,
    deactivateError,
    dispatch,
    id,
    navigate,
  ]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle edit staff
  const handleEditStaff = () => {
    navigate(`${ROUTES.EDIT_STAFF.replace(":id", id)}`);
  };

  // Handle delete staff
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Handle staff status change
  const handleStatusClick = (action) => {
    setStatusAction(action);
    setIsStatusModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (staff) {
      dispatch(deleteStaff(staff.id));
    }
  };

  // Handle status change confirmation
  const handleStatusConfirm = () => {
    if (staff) {
      if (statusAction === "activate") {
        dispatch(activateStaff(staff.id));
      } else if (statusAction === "deactivate") {
        dispatch(deactivateStaff(staff.id));
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate(ROUTES.STAFF);
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  // Handle complaint pagination change
  const handlePageChange = (page) => {
    setComplaintPagination({
      ...complaintPagination,
      page,
    });
  };

  // Handle rows per page change
  const handleLimitChange = (limit) => {
    setComplaintPagination({
      ...complaintPagination,
      page: 1,
      limit,
    });
  };

  // Table columns for assigned complaints
  const complaintColumns = [
    {
      field: "id",
      header: "ID",
      width: "70px",
    },
    {
      field: "title",
      header: "Title",
      render: (value) => (
        <Typography
          variant="body2"
          className="font-medium cursor-pointer hover:text-primary-600"
          onClick={() => navigate(`${ROUTES.COMPLAINT_DETAILS}/${value}`)}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "subject",
      header: "Subject",
    },
    {
      field: "student",
      header: "Student",
      render: (value) => value?.name || "N/A",
    },
    {
      field: "status",
      header: "Status",
      render: (value) => (
        <Chip
          label={value}
          color={
            value === "COMPLETED"
              ? "success"
              : value === "IN_PROGRESS"
              ? "primary"
              : value === "ASSIGNED"
              ? "info"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "created_at",
      header: "Created",
      render: (value) => formatDate(value, "medium"),
    },
  ];

  // Show loading state
  if (status === "loading") {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex justify-center items-center" sx={{ py: 8 }}>
            <Typography variant="h6">Loading staff information...</Typography>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="mr-4"
            >
              Back to Staff List
            </Button>
            <Typography variant="h4" component="h1" className="font-bold">
              Error Loading Staff
            </Typography>
          </Box>

          <Alert severity="error" title="Error" className="mb-4">
            {error}
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Return to Staff List
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  // Show not found state
  if (!staff) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box className="flex items-center mb-6">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="mr-4"
            >
              Back to Staff List
            </Button>
            <Typography variant="h4" component="h1" className="font-bold">
              Staff Not Found
            </Typography>
          </Box>

          <Alert severity="warning" title="Not Found" className="mb-4">
            The staff member you are looking for does not exist or has been
            deleted.
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Return to Staff List
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Alert */}
        <Alert
          severity={alertConfig.severity}
          isSnackbar
          open={alertConfig.open}
          onClose={handleCloseAlert}
          autoHideDuration={5000}
        >
          {alertConfig.message}
        </Alert>

        {/* Page Header */}
        <Box className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <Box className="flex items-center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="mr-4"
            >
              Back
            </Button>
            <Box>
              <Typography variant="h4" component="h1" className="font-bold">
                {staff.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {staff.department ? `${staff.department}` : "Staff Member"}
                {staff.specialization ? ` • ${staff.specialization}` : ""}
              </Typography>
            </Box>
          </Box>

          <Box className="flex flex-wrap gap-2">
            {staff.is_active ? (
              <>
                <Chip
                  label="Active"
                  color="success"
                  icon={<CheckCircleIcon />}
                  className="font-medium"
                />

                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<CancelIcon />}
                  onClick={() => handleStatusClick("deactivate")}
                  size="small"
                >
                  Deactivate
                </Button>
              </>
            ) : (
              <>
                <Chip
                  label="Inactive"
                  color="default"
                  icon={<CancelIcon />}
                  className="font-medium"
                />

                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStatusClick("activate")}
                  size="small"
                >
                  Activate
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditStaff}
              size="small"
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
              size="small"
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper className="mb-6">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="staff tabs"
          >
            <Tab
              label="Profile"
              id="staff-tab-0"
              aria-controls="staff-tabpanel-0"
            />
            <Tab
              label="Assigned Complaints"
              id="staff-tab-1"
              aria-controls="staff-tabpanel-1"
            />
          </Tabs>
        </Paper>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} md={4}>
              <Card
                title="Personal Information"
                titleIcon={<PersonIcon />}
                className="h-full"
              >
                <Box className="flex flex-col items-center mb-6">
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    className="mb-4 bg-primary-100 text-primary-600"
                  >
                    {staff.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant="h5" className="font-bold">
                    {staff.name}
                  </Typography>

                  {staff.department && (
                    <Typography variant="body2" color="textSecondary">
                      {staff.department}
                    </Typography>
                  )}

                  {staff.specialization && (
                    <Typography variant="body2" color="textSecondary">
                      {staff.specialization}
                    </Typography>
                  )}
                </Box>

                <Divider className="mb-4" />

                <Box className="space-y-4">
                  <Box className="flex items-center">
                    <EmailIcon className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Email Address
                      </Typography>
                      <Typography variant="body2">{staff.email}</Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center">
                    <PhoneIcon className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Mobile Number
                      </Typography>
                      <Typography variant="body2">{staff.mobile_no}</Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center">
                    <BadgeIcon className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Staff ID
                      </Typography>
                      <Typography variant="body2">{staff.id_no}</Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center">
                    <CakeIcon className="text-gray-500 mr-3" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(staff.date_of_birth, "long")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={4}>
              <Card
                title="Professional Information"
                titleIcon={<WorkIcon />}
                className="h-full"
              >
                <Box className="space-y-4">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Department
                    </Typography>
                    <Typography variant="body2">
                      {staff.department || "Not specified"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Specialization
                    </Typography>
                    <Typography variant="body2">
                      {staff.specialization || "Not specified"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      NIC Number
                    </Typography>
                    <Typography variant="body2">{staff.nic_no}</Typography>
                  </Box>

                  <Divider className="my-2" />

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Account Status
                    </Typography>
                    <Chip
                      label={staff.is_active ? "Active" : "Inactive"}
                      color={staff.is_active ? "success" : "default"}
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Account Created
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(staff.created_at, "long")}
                    </Typography>
                  </Box>

                  {staff.last_login_at && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        Last Login
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(staff.last_login_at, "full")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Card
                title="Contact Information"
                titleIcon={<LocationOnIcon />}
                className="h-full"
              >
                <Box className="space-y-4">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Address
                    </Typography>
                    <Typography variant="body2">
                      {staff.address || "Not provided"}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        City
                      </Typography>
                      <Typography variant="body2">
                        {staff.city || "Not provided"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        State/Province
                      </Typography>
                      <Typography variant="body2">
                        {staff.state || "Not provided"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        Postal Code
                      </Typography>
                      <Typography variant="body2">
                        {staff.zip || "Not provided"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        Country
                      </Typography>
                      <Typography variant="body2">
                        {staff.country || "Not provided"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider className="my-2" />

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Primary Email
                    </Typography>
                    <Typography variant="body2">{staff.email}</Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="font-medium mb-1"
                    >
                      Mobile Number
                    </Typography>
                    <Typography variant="body2">{staff.mobile_no}</Typography>
                  </Box>

                  {staff.fixed_no && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        className="font-medium mb-1"
                      >
                        Fixed Number
                      </Typography>
                      <Typography variant="body2">{staff.fixed_no}</Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Assigned Complaints Tab */}
        <TabPanel value={activeTab} index={1}>
          <Card title="Assigned Complaints" titleIcon={<AssignmentIcon />}>
            <Table
              columns={complaintColumns}
              data={assignedComplaints}
              loading={false}
              error={null}
              emptyMessage="No complaints assigned to this staff member"
              pagination={
                <Pagination
                  count={complaintPagination.totalPages}
                  page={complaintPagination.page}
                  onChange={handlePageChange}
                  showRowsPerPage
                  rowsPerPage={complaintPagination.limit}
                  onRowsPerPageChange={handleLimitChange}
                  rowsPerPageOptions={PAGINATION.LIMIT_OPTIONS}
                  total={complaintPagination.total}
                />
              }
            />
          </Card>
        </TabPanel>

        {/* Delete Confirmation Modal */}
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
          size="sm"
          actions={
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteStatus === "loading"}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
                disabled={deleteStatus === "loading"}
              >
                {deleteStatus === "loading" ? "Deleting..." : "Delete"}
              </Button>
            </>
          }
        >
          <Typography variant="body1">
            Are you sure you want to delete {staff.name}? This action cannot be
            undone and will remove all associated data.
          </Typography>
        </Modal>

        {/* Status Change Confirmation Modal */}
        <Modal
          open={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title={`Confirm ${
            statusAction === "activate" ? "Activation" : "Deactivation"
          }`}
          size="sm"
          actions={
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={
                  activateStatus === "loading" || deactivateStatus === "loading"
                }
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color={statusAction === "activate" ? "success" : "warning"}
                onClick={handleStatusConfirm}
                disabled={
                  activateStatus === "loading" || deactivateStatus === "loading"
                }
              >
                {activateStatus === "loading" || deactivateStatus === "loading"
                  ? "Processing..."
                  : statusAction === "activate"
                  ? "Activate"
                  : "Deactivate"}
              </Button>
            </>
          }
        >
          <Typography variant="body1">
            Are you sure you want to{" "}
            {statusAction === "activate" ? "activate" : "deactivate"}{" "}
            {staff.name}?
            {statusAction === "deactivate" &&
              " The staff member will no longer be able to access the system."}
          </Typography>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default StaffProfile;
