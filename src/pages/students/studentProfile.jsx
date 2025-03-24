import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/common/alert";
import Table from "../../components/common/table";
import DashboardLayout from "../../components/layout/dashboardlayout";

// Import API service (to be implemented)
// import { getStudentById, getStudentComplaints } from '../services/api';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);

        // In real implementation, call API
        // const studentData = await getStudentById(id);
        // setStudent(studentData);

        // Simulate API call
        setTimeout(() => {
          // Mock student data
          const mockStudent = {
            id: parseInt(id),
            name: `Student ${id}`,
            email: `student${id}@example.com`,
            mobile_no: `+9477${Math.floor(1000000 + Math.random() * 9000000)}`,
            id_no: `STU${String(id).padStart(3, "0")}`,
            date_of_birth: `1995-${String(
              Math.floor(Math.random() * 12) + 1
            ).padStart(2, "0")}-${String(
              Math.floor(Math.random() * 28) + 1
            ).padStart(2, "0")}`,
            nic_no: `${95}${String(Math.floor(Math.random() * 12) + 1).padStart(
              2,
              "0"
            )}${String(Math.floor(Math.random() * 28) + 1).padStart(
              2,
              "0"
            )}${Math.floor(100000 + Math.random() * 900000)}V`,
            address: "123 University Lane",
            city: "Colombo",
            state: "Western Province",
            zip: "10100",
            is_active: true,
            created_at: new Date(
              Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
            ).toISOString(),
          };

          setStudent(mockStudent);
          setLoading(false);
        }, 1000);
      } catch {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch student data. Please try again.");
        setAlertOpen(true);
        setLoading(false);

        // Navigate back to student list after a delay
        setTimeout(() => {
          navigate("/students");
        }, 2000);
      }
    };

    fetchStudentData();
  }, [id, navigate]);

  // Fetch student complaints when tab changes to complaints
  useEffect(() => {
    const fetchStudentComplaints = async () => {
      if (tabValue === 1 && !complaints.length) {
        try {
          setComplaintsLoading(true);

          // In real implementation, call API
          // const complaintsData = await getStudentComplaints(id);
          // setComplaints(complaintsData);

          // Simulate API call
          setTimeout(() => {
            // Mock complaints data
            const mockComplaints = Array(Math.floor(Math.random() * 5) + 1)
              .fill(0)
              .map((_, index) => ({
                id: index + 1,
                title: `Issue with ${
                  ["Registration", "Course", "Exam", "Payment", "Attendance"][
                    Math.floor(Math.random() * 5)
                  ]
                }`,
                subject: `${
                  [
                    "Academic",
                    "Administrative",
                    "Technical",
                    "Financial",
                    "Other",
                  ][Math.floor(Math.random() * 5)]
                } Issue`,
                status: [
                  "PENDING",
                  "ASSIGNED",
                  "IN_PROGRESS",
                  "COMPLETED",
                  "DROPPED",
                ][Math.floor(Math.random() * 5)],
                created_at: new Date(
                  Date.now() -
                    Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
                ).toISOString(),
                resolved_at:
                  Math.random() > 0.5
                    ? new Date(
                        Date.now() -
                          Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
                      ).toISOString()
                    : null,
              }));

            setComplaints(mockComplaints);
            setComplaintsLoading(false);
          }, 800);
        } catch {
          setComplaintsLoading(false);
        }
      }
    };

    fetchStudentComplaints();
  }, [tabValue, id, complaints.length]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ASSIGNED":
        return "info";
      case "IN_PROGRESS":
        return "primary";
      case "COMPLETED":
        return "success";
      case "DROPPED":
        return "error";
      default:
        return "default";
    }
  };

  // Complaints table columns
  const complaintColumns = [
    {
      field: "title",
      header: "Title",
      minWidth: 200,
      render: (value, row) => (
        <Link
          to={`/complaints/${row.id}`}
          className="text-blue-600 hover:underline"
        >
          {value}
        </Link>
      ),
    },
    { field: "subject", header: "Subject", minWidth: 150 },
    {
      field: "status",
      header: "Status",
      minWidth: 120,
      render: (value) => (
        <Chip
          label={value.replace("_", " ")}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      field: "created_at",
      header: "Created",
      minWidth: 150,
      render: (value) => formatDate(value),
    },
    {
      field: "resolved_at",
      header: "Resolved",
      minWidth: 150,
      render: (value) => (value ? formatDate(value) : "Not resolved"),
    },
  ];

  // Close alert
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Loading skeleton
  if (loading) {
    return (
      <DashboardLayout>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          className="mb-4"
        >
          <Skeleton width={80} />
          <Skeleton width={80} />
          <Skeleton width={120} />
        </Breadcrumbs>

        <Box className="mb-6 flex justify-between items-center">
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>

        <Paper className="overflow-hidden">
          <Box className="p-4 flex items-center border-b">
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              className="mr-4"
            />
            <Box>
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={160} height={24} />
            </Box>
          </Box>

          <Box className="p-4">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              className="mb-4"
            />
            <Grid container spacing={3}>
              {[...Array(8)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Skeleton variant="text" width="100%" height={24} />
                  <Skeleton variant="text" width="60%" height={24} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <Alert severity="error" title="Error" isSnackbar={false}>
          Student not found. The requested student may have been deleted.
        </Alert>
        <Box className="mt-4">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/students"
          >
            Back to Students
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

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
        <Typography color="textPrimary">Student Profile</Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box className="mb-6 flex justify-between items-center">
        <Typography variant="h4" className="font-bold">
          Student Profile
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/students"
            className="mr-2"
          >
            Back to List
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/students/edit/${id}`}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Profile card */}
      <Paper className="overflow-hidden mb-6">
        {/* Header */}
        <Box className="p-6 flex flex-col sm:flex-row items-center sm:items-start border-b bg-gray-50">
          <Avatar
            className="bg-blue-700 w-20 h-20 mb-4 sm:mb-0 sm:mr-6"
            alt={student.name}
          >
            <PersonIcon style={{ fontSize: 40 }} />
          </Avatar>

          <Box className="text-center sm:text-left">
            <Box className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Typography variant="h4" className="font-bold">
                {student.name}
              </Typography>
              <Chip
                label={student.is_active ? "Active" : "Inactive"}
                color={student.is_active ? "success" : "error"}
                icon={student.is_active ? <CheckCircleIcon /> : <CancelIcon />}
                className="ml-0 sm:ml-2"
              />
            </Box>

            <Typography variant="body1" color="textSecondary" className="mt-1">
              Student ID: {student.id_no}
            </Typography>

            <Typography variant="body2" color="textSecondary" className="mt-1">
              Registered on {formatDate(student.created_at)}
            </Typography>
          </Box>

          <Box className="flex-grow" />

          <Box className="hidden sm:block">
            <Tooltip title="Edit Student">
              <IconButton
                color="primary"
                component={Link}
                to={`/students/edit/${id}`}
                className="mr-1"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Student">
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs */}
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Basic Information" />
            <Tab label="Complaints History" />
          </Tabs>

          {/* Basic Information Tab */}
          <Box hidden={tabValue !== 0} className="p-6">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="h-full">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-4 flex items-center"
                    >
                      <BadgeIcon className="mr-2 text-blue-600" />
                      Personal Information
                    </Typography>

                    <Box className="space-y-4">
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.name}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          NIC Number
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.nic_no}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {formatDate(student.date_of_birth)} (
                          {calculateAge(student.date_of_birth)} years)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="h-full">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-4 flex items-center"
                    >
                      <EmailIcon className="mr-2 text-blue-600" />
                      Contact Information
                    </Typography>

                    <Box className="space-y-4">
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.email}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Mobile Number
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.mobile_no}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-4 flex items-center"
                    >
                      <LocationOnIcon className="mr-2 text-blue-600" />
                      Address Information
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Street Address
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.address || "Not provided"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">
                          City
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.city || "Not provided"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">
                          State/Province
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.state || "Not provided"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">
                          ZIP/Postal Code
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {student.zip || "Not provided"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-4 flex items-center"
                    >
                      <EventIcon className="mr-2 text-blue-600" />
                      Account Information
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Account Status
                        </Typography>
                        <Box className="flex items-center mt-1">
                          {student.is_active ? (
                            <>
                              <CheckCircleIcon
                                className="mr-1 text-green-600"
                                fontSize="small"
                              />
                              <Typography
                                variant="body1"
                                className="font-medium text-green-600"
                              >
                                Active
                              </Typography>
                            </>
                          ) : (
                            <>
                              <CancelIcon
                                className="mr-1 text-red-600"
                                fontSize="small"
                              />
                              <Typography
                                variant="body1"
                                className="font-medium text-red-600"
                              >
                                Inactive
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Registration Date
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {formatDate(student.created_at)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Complaints History Tab */}
          <Box hidden={tabValue !== 1} className="p-6">
            <Box className="flex items-center mb-4">
              <ReportProblemIcon className="mr-2 text-amber-600" />
              <Typography variant="h6" className="font-semibold">
                Complaints History
              </Typography>
            </Box>

            <Table
              columns={complaintColumns}
              data={complaints}
              loading={complaintsLoading}
              emptyMessage="No complaints found for this student"
            />
          </Box>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default StudentProfile;
