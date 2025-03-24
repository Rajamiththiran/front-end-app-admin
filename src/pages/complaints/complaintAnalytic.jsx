// src/pages/complaints/complaintAnalytic.jsx
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ActivityFeed from "../../components/dashboard/activityFeed";
import OverviewChart from "../../components/dashboard/overviewChart";
import StatCard from "../../components/dashboard/statCard";
import DashboardLayout from "../../components/layout/dashboardlayout";
import useAuth from "../../hooks/useAuth";
import { fetchComplaintStats } from "../../store/complaintSlice";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { CHART_COLORS, COMPLAINT_STATUS } from "../../utils/constants";

const ComplaintAnalytic = () => {
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("line");

  // Redux state
  const {
    stats: { data, status },
  } = useSelector((state) => state.complaints);

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Load complaint statistics
  useEffect(() => {
    dispatch(fetchComplaintStats());
  }, [dispatch]);

  // Mock data for charts - would be replaced with actual API data
  const generateMockData = () => {
    // Mock data for monthly stats
    const monthlyData = [
      {
        name: "Jan",
        pending: 12,
        assigned: 8,
        completed: 5,
        dropped: 3,
        total: 28,
      },
      {
        name: "Feb",
        pending: 15,
        assigned: 10,
        completed: 7,
        dropped: 2,
        total: 34,
      },
      {
        name: "Mar",
        pending: 18,
        assigned: 12,
        completed: 9,
        dropped: 4,
        total: 43,
      },
      {
        name: "Apr",
        pending: 14,
        assigned: 15,
        completed: 12,
        dropped: 3,
        total: 44,
      },
      {
        name: "May",
        pending: 16,
        assigned: 14,
        completed: 15,
        dropped: 5,
        total: 50,
      },
      {
        name: "Jun",
        pending: 19,
        assigned: 17,
        completed: 14,
        dropped: 4,
        total: 54,
      },
    ];

    // Mock data for weekly stats
    const weeklyData = [
      {
        name: "Week 1",
        pending: 5,
        assigned: 4,
        completed: 3,
        dropped: 1,
        total: 13,
      },
      {
        name: "Week 2",
        pending: 7,
        assigned: 5,
        completed: 4,
        dropped: 2,
        total: 18,
      },
      {
        name: "Week 3",
        pending: 6,
        assigned: 8,
        completed: 5,
        dropped: 1,
        total: 20,
      },
      {
        name: "Week 4",
        pending: 9,
        assigned: 7,
        completed: 6,
        dropped: 3,
        total: 25,
      },
    ];

    // Mock data for yearly stats
    const yearlyData = [
      {
        name: "2022",
        pending: 120,
        assigned: 100,
        completed: 90,
        dropped: 30,
        total: 340,
      },
      {
        name: "2023",
        pending: 150,
        assigned: 130,
        completed: 110,
        dropped: 40,
        total: 430,
      },
      {
        name: "2024",
        pending: 180,
        assigned: 160,
        completed: 140,
        dropped: 50,
        total: 530,
      },
      {
        name: "2025",
        pending: 200,
        assigned: 180,
        completed: 160,
        dropped: 60,
        total: 600,
      },
    ];

    return {
      week: {
        label: "This Week",
        data: weeklyData,
      },
      month: {
        label: "Last 6 Months",
        data: monthlyData,
      },
      year: {
        label: "Yearly",
        data: yearlyData,
      },
    };
  };

  const chartData = generateMockData();

  // Prepare complaint activity feed data
  const getComplaintActivities = () => {
    // This would typically come from your API
    return [
      {
        id: 1,
        type: "complaint",
        title: "New Complaint Created",
        description:
          "A new complaint about course materials has been submitted",
        time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: COMPLAINT_STATUS.PENDING,
        link: "/complaints/1",
      },
      {
        id: 2,
        type: "complaint_resolved",
        title: "Complaint Resolved",
        description: "The wifi connectivity issue has been resolved",
        time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: COMPLAINT_STATUS.COMPLETED,
        link: "/complaints/2",
      },
      {
        id: 3,
        type: "complaint",
        title: "Complaint Assigned",
        description: "Library access complaint has been assigned to Kumar",
        time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: COMPLAINT_STATUS.ASSIGNED,
        link: "/complaints/3",
      },
      {
        id: 4,
        type: "complaint_dropped",
        title: "Complaint Dropped",
        description: "The duplicate complaint about cafeteria has been dropped",
        time: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        status: COMPLAINT_STATUS.DROPPED,
        link: "/complaints/4",
      },
    ];
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Complaint Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Visualize and analyze complaint patterns and trends
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Complaints"
              value={data?.total || 0}
              icon={<ReportProblemIcon />}
              iconBgColor="bg-blue-500"
              loading={status === "loading"}
              secondaryText="This month"
              secondaryValue={data?.recent || 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={data?.byStatus?.[COMPLAINT_STATUS.PENDING] || 0}
              icon={<AssignmentIndIcon />}
              iconBgColor="bg-amber-500"
              loading={status === "loading"}
              secondaryText="Total"
              secondaryValue={`${
                data
                  ? Math.round(
                      ((data.byStatus?.[COMPLAINT_STATUS.PENDING] || 0) /
                        data.total) *
                        100
                    )
                  : 0
              }%`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={data?.byStatus?.[COMPLAINT_STATUS.COMPLETED] || 0}
              icon={<CheckCircleIcon />}
              iconBgColor="bg-green-500"
              loading={status === "loading"}
              secondaryText="Total"
              secondaryValue={`${
                data
                  ? Math.round(
                      ((data.byStatus?.[COMPLAINT_STATUS.COMPLETED] || 0) /
                        data.total) *
                        100
                    )
                  : 0
              }%`}
              trend="up"
              trendValue={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Dropped"
              value={data?.byStatus?.[COMPLAINT_STATUS.DROPPED] || 0}
              icon={<BlockIcon />}
              iconBgColor="bg-red-500"
              loading={status === "loading"}
              secondaryText="Total"
              secondaryValue={`${
                data
                  ? Math.round(
                      ((data.byStatus?.[COMPLAINT_STATUS.DROPPED] || 0) /
                        data.total) *
                        100
                    )
                  : 0
              }%`}
            />
          </Grid>
        </Grid>

        {/* Main Charts */}
        <Grid container spacing={4} className="mb-6">
          <Grid item xs={12} lg={8}>
            <Paper className="p-4">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Complaint Trends
                </Typography>
                <Box className="flex items-center space-x-2">
                  <TextField
                    select
                    size="small"
                    label="Time Range"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="week">Weekly</MenuItem>
                    <MenuItem value="month">Monthly</MenuItem>
                    <MenuItem value="year">Yearly</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Chart Type"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="line">Line</MenuItem>
                    <MenuItem value="bar">Bar</MenuItem>
                    <MenuItem value="combo">Combo</MenuItem>
                  </TextField>
                </Box>
              </Box>

              <OverviewChart
                data={chartData[timeRange].data}
                title={chartData[timeRange].label}
                type={chartType}
                allowTypeToggle={false}
                xAxisKey="name"
                lines={[
                  {
                    key: "total",
                    name: "Total Complaints",
                    color: CHART_COLORS.PRIMARY,
                  },
                  {
                    key: "pending",
                    name: "Pending",
                    color: CHART_COLORS.PENDING,
                  },
                  {
                    key: "completed",
                    name: "Completed",
                    color: CHART_COLORS.COMPLETED,
                  },
                ]}
                bars={[
                  {
                    key: "assigned",
                    name: "Assigned",
                    color: CHART_COLORS.ASSIGNED,
                  },
                  {
                    key: "dropped",
                    name: "Dropped",
                    color: CHART_COLORS.DROPPED,
                  },
                ]}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ActivityFeed
              title="Recent Complaint Activities"
              activities={getComplaintActivities()}
              loading={false}
              emptyMessage="No recent complaint activities"
              maxItems={5}
              viewAllLink="/complaints"
            />
          </Grid>
        </Grid>

        {/* Additional Charts */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" className="font-semibold mb-4">
                Complaints by Status
              </Typography>
              {/* Here you would add a pie chart component */}
              <Box className="h-72 flex items-center justify-center">
                <Typography variant="body1" color="textSecondary">
                  Pie chart will be implemented here
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" className="font-semibold mb-4">
                Resolution Time
              </Typography>
              {/* Here you would add a chart for resolution time */}
              <Box className="h-72 flex items-center justify-center">
                <Typography variant="body1" color="textSecondary">
                  Resolution time chart will be implemented here
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default ComplaintAnalytic;
