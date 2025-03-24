// src/pages/complaints/complaints.jsx
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchAdminComplaints,
  fetchComplaintStats,
  resetAdminComplaintList,
  setAdminListFilters,
  setAdminListPagination,
} from "../../store/complaintSlice";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
import Pagination from "../../components/common/pagination";
import Table from "../../components/common/table";
import AssignComplaint from "../../components/complaints/assignComplaint";
import ComplaintStat from "../../components/complaints/complaintStat";

import DashboardLayout from "../../components/layout/dashboardlayout";
import useAuth from "../../hooks/useAuth";
import useSearch from "../../hooks/useSearch";
import useSortTable from "../../hooks/useSortTable";
import {
  COMPLAINT_STATUS,
  PAGINATION,
  ROUTES,
  STATUS_COLORS,
} from "../../utils/constants";
import { formatTimeAgo } from "../../utils/formatters";

const Complaints = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Redux state
  const {
    adminList: { items, status, error, pagination, filters },
    stats: { data: statsData, status: statsStatus },
  } = useSelector((state) => state.complaints);

  // Local state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const [setFilterMenuOpen] = useState(false);
  const [setFilterAnchorEl] = useState(null);

  // Initialize search hook
  const { searchProps } = useSearch({
    initialQuery: filters.search || "",
    onSearch: (searchQuery) => {
      dispatch(setAdminListFilters({ search: searchQuery }));
      loadComplaints();
    },
    debounceTime: 500,
  });

  // Initialize sort hook
  const { sortConfig, handleSort } = useSortTable({
    defaultSortField: "created_at",
    defaultDirection: "desc",
    serverSide: true,
    onSort: () => {
      // Implement server-side sorting here if needed
      loadComplaints();
    },
  });

  // Load complaints on mount and when filters/pagination change
  useEffect(() => {
    loadComplaints();
    // Load complaint statistics
    dispatch(fetchComplaintStats());

    // Cleanup on unmount
    return () => {
      dispatch(resetAdminComplaintList());
    };
  }, [dispatch]);

  // Load complaints function
  const loadComplaints = () => {
    dispatch(
      fetchAdminComplaints({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || "",
        student_id: filters.student_id || undefined,
        assigned_staff_id: filters.assigned_staff_id || undefined,
        search: filters.search || "",
      })
    );
  };

  // Handle status filter change
  const handleStatusChange = (event) => {
    dispatch(setAdminListFilters({ status: event.target.value }));
    loadComplaints();
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    dispatch(setAdminListPagination({ page }));
    loadComplaints();
  };

  // Handle rows per page change
  const handleLimitChange = (limit) => {
    dispatch(setAdminListPagination({ page: 1, limit }));
    loadComplaints();
  };

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterMenuOpen(true);
  };

  // Handle clear filters

  // Handle refresh
  const handleRefresh = () => {
    loadComplaints();
    dispatch(fetchComplaintStats());
  };

  // Handle view complaint details
  const handleViewComplaint = (complaint) => {
    navigate(`${ROUTES.COMPLAINT_DETAILS}/${complaint.id}`);
  };

  // Handle assign complaint
  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignModalOpen(true);
  };

  // Handle drop complaint
  const handleDropClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDropModalOpen(true);
  };

  // Table columns
  const columns = [
    {
      field: "id",
      header: "ID",
      width: "80px",
      render: (value) => `#${value}`,
    },
    {
      field: "title",
      header: "Title",
      sortable: true,
      render: (value, row) => (
        <Typography
          variant="body2"
          className="font-medium cursor-pointer hover:text-primary-600"
          onClick={() => handleViewComplaint(row)}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "subject",
      header: "Subject",
      sortable: true,
    },
    {
      field: "students",
      header: "Student",
      render: (value) => value?.name || "N/A",
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <Box
          className={`px-2 py-1 rounded-full text-center text-xs font-medium ${
            STATUS_COLORS[value] || "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </Box>
      ),
    },
    {
      field: "staffs",
      header: "Assigned To",
      render: (value) => value?.name || "Not Assigned",
    },
    {
      field: "created_at",
      header: "Created",
      sortable: true,
      render: (value) => formatTimeAgo(value),
    },
    {
      field: "actions",
      header: "Actions",
      align: "center",
      render: (_, row) => (
        <Box className="flex items-center justify-center space-x-1">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewComplaint(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {row.status === COMPLAINT_STATUS.PENDING && (
            <>
              <Tooltip title="Assign to Staff">
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => handleAssignClick(row)}
                >
                  <AssignmentIndIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Drop Complaint">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDropClick(row)}
                >
                  <DoDisturbIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Complaints Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View and manage student complaints
          </Typography>
        </Box>

        {/* Statistics Section */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={6} lg={3}>
            <ComplaintStat
              title="Total Complaints"
              value={statsData?.total || 0}
              loading={statsStatus === "loading"}
              icon={<FilterListIcon />}
              iconBgColor="bg-blue-500"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplaintStat
              title="Pending"
              value={statsData?.byStatus?.[COMPLAINT_STATUS.PENDING] || 0}
              loading={statsStatus === "loading"}
              icon={<FilterListIcon />}
              iconBgColor="bg-amber-500"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplaintStat
              title="In Progress"
              value={
                (statsData?.byStatus?.[COMPLAINT_STATUS.ASSIGNED] || 0) +
                (statsData?.byStatus?.[COMPLAINT_STATUS.IN_PROGRESS] || 0)
              }
              loading={statsStatus === "loading"}
              icon={<FilterListIcon />}
              iconBgColor="bg-indigo-500"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplaintStat
              title="Resolved"
              value={
                (statsData?.byStatus?.[COMPLAINT_STATUS.COMPLETED] || 0) +
                (statsData?.byStatus?.[COMPLAINT_STATUS.DROPPED] || 0)
              }
              loading={statsStatus === "loading"}
              icon={<FilterListIcon />}
              iconBgColor="bg-green-500"
            />
          </Grid>
        </Grid>

        {/* Filters and Search Section */}
        <Box className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Box className="flex items-center gap-2">
            <TextField
              select
              label="Status"
              value={filters.status || ""}
              onChange={handleStatusChange}
              size="small"
              className="min-w-[150px]"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value={COMPLAINT_STATUS.PENDING}>Pending</MenuItem>
              <MenuItem value={COMPLAINT_STATUS.ASSIGNED}>Assigned</MenuItem>
              <MenuItem value={COMPLAINT_STATUS.IN_PROGRESS}>
                In Progress
              </MenuItem>
              <MenuItem value={COMPLAINT_STATUS.COMPLETED}>Completed</MenuItem>
              <MenuItem value={COMPLAINT_STATUS.DROPPED}>Dropped</MenuItem>
            </TextField>

            <Tooltip title="More Filters">
              <IconButton onClick={handleFilterMenuOpen}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="w-full md:w-auto md:min-w-[300px]">
            <TextField
              {...searchProps}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search complaints..."
            />
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            title="Error Loading Complaints"
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        {/* Complaints Table */}
        <Card className="mb-4">
          <Table
            columns={columns}
            data={items}
            loading={status === "loading"}
            error={error}
            emptyMessage="No complaints found"
            sort={sortConfig}
            onSort={handleSort}
            pagination={
              <Pagination
                count={pagination.totalPages || 0}
                page={pagination.page || 1}
                onChange={handlePageChange}
                showRowsPerPage
                rowsPerPage={pagination.limit || PAGINATION.DEFAULT_LIMIT}
                onRowsPerPageChange={handleLimitChange}
                rowsPerPageOptions={PAGINATION.LIMIT_OPTIONS}
                total={pagination.total || 0}
              />
            }
          />
        </Card>

        {/* Assign Complaint Modal */}
        <Modal
          open={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Complaint to Staff"
          size="md"
        >
          {selectedComplaint && (
            <AssignComplaint
              complaint={selectedComplaint}
              onSuccess={() => {
                setIsAssignModalOpen(false);
                loadComplaints();
              }}
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
                disabled={!dropReason.trim()}
                onClick={() => {
                  // Handle drop complaint logic here
                  setIsDropModalOpen(false);
                  setDropReason("");
                  loadComplaints();
                }}
              >
                Drop Complaint
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
            />
          </Box>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default Complaints;
