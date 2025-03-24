import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/card";
import DashboardLayout from "../../components/layout/dashboardlayout";

// Import API service (to be implemented)
// import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: {
      total: 0,
      active: 0,
    },
    staff: {
      total: 0,
      active: 0,
    },
    complaints: {
      total: 0,
      pending: 0,
      assigned: 0,
      completed: 0,
      dropped: 0,
      recent: 0,
    },
  });

  // Recent activity data (could come from API)
  const recentActivities = [
    {
      id: 1,
      type: "complaint",
      message: "New complaint created by John Doe",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "staff",
      message: "Staff account Kumar activated",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "student",
      message: "New student Jane Doe registered",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "complaint",
      message: "Complaint #1024 assigned to staff",
      time: "5 hours ago",
    },
    {
      id: 5,
      type: "complaint",
      message: "Complaint #1020 resolved",
      time: "1 day ago",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch data from API
        // const data = await getDashboardStats();
        // setStats(data);

        // Simulating API response with sample data
        setTimeout(() => {
          setStats({
            students: {
              total: 145,
              active: 132,
            },
            staff: {
              total: 28,
              active: 25,
            },
            complaints: {
              total: 87,
              pending: 12,
              assigned: 31,
              completed: 38,
              dropped: 6,
              recent: 14,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stat cards component for reusability
  const StatCard = ({
    title,
    value,
    icon,
    color,
    secondaryText,
    secondaryValue,
  }) => (
    <Paper elevation={1} className="p-4 h-full">
      <Box className="flex items-center mb-3">
        <Box className={`rounded-full p-2 mr-3 ${color}`}>{icon}</Box>
        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" className="font-bold mb-2">
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>
      {secondaryText && (
        <Typography variant="body2" color="textSecondary">
          {secondaryText}:{" "}
          <span className="font-semibold">
            {loading ? "-" : secondaryValue}
          </span>
        </Typography>
      )}
    </Paper>
  );

  return (
    <DashboardLayout>
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to your admin dashboard
        </Typography>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.students.total}
            icon={<PeopleIcon className="text-white" />}
            color="bg-blue-500"
            secondaryText="Active"
            secondaryValue={stats.students.active}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Staff"
            value={stats.staff.total}
            icon={<PersonIcon className="text-white" />}
            color="bg-green-500"
            secondaryText="Active"
            secondaryValue={stats.staff.active}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Complaints"
            value={stats.complaints.total}
            icon={<ReportProblemIcon className="text-white" />}
            color="bg-amber-500"
            secondaryText="Pending"
            secondaryValue={stats.complaints.pending}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.complaints.completed}
            icon={<CheckCircleOutlineIcon className="text-white" />}
            color="bg-purple-500"
            secondaryText="Success Rate"
            secondaryValue={`${Math.round(
              (stats.complaints.completed / stats.complaints.total) * 100
            )}%`}
          />
        </Grid>
      </Grid>

      {/* Complaints Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={8}>
          <Card
            title="Complaint Status Overview"
            titleIcon={<ReportProblemIcon fontSize="small" color="primary" />}
            elevation={1}
          >
            {loading ? (
              <Box className="flex justify-center items-center p-10">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3} className="p-2">
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 border rounded-lg">
                    <Typography
                      variant="h5"
                      className="font-bold text-yellow-600"
                    >
                      {stats.complaints.pending}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 border rounded-lg">
                    <Typography
                      variant="h5"
                      className="font-bold text-blue-600"
                    >
                      {stats.complaints.assigned}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Assigned
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 border rounded-lg">
                    <Typography
                      variant="h5"
                      className="font-bold text-green-600"
                    >
                      {stats.complaints.completed}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className="flex justify-end">
                    <Button
                      component={Link}
                      to="/complaints"
                      variant="outlined"
                      color="primary"
                      size="small"
                      endIcon={<MoreHorizIcon />}
                    >
                      See All Complaints
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card title="New Registrations" elevation={1}>
            <Box className="flex justify-between mb-4">
              <Typography variant="body2" color="textSecondary">
                New Students (This Week)
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {loading ? <CircularProgress size={16} /> : 8}
              </Typography>
            </Box>
            <Box className="flex justify-between mb-4">
              <Typography variant="body2" color="textSecondary">
                New Staff (This Week)
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {loading ? <CircularProgress size={16} /> : 2}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="body2" color="textSecondary">
                Recent Complaints (Last 7 Days)
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {loading ? (
                  <CircularProgress size={16} />
                ) : (
                  stats.complaints.recent
                )}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Card title="Recent Activities" elevation={1}>
        <Box>
          {recentActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <Box className="py-3 flex">
                <Box
                  className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 
                    ${
                      activity.type === "complaint"
                        ? "bg-amber-100"
                        : activity.type === "student"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                >
                  {activity.type === "complaint" ? (
                    <ReportProblemIcon
                      className="text-amber-600"
                      fontSize="small"
                    />
                  ) : activity.type === "student" ? (
                    <PeopleIcon className="text-blue-600" fontSize="small" />
                  ) : (
                    <PersonIcon className="text-green-600" fontSize="small" />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2">{activity.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
              {index < recentActivities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
