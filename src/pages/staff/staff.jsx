// src/pages/staff/staff.jsx
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  activateStaff,
  deactivateStaff,
  deleteStaff,
  fetchStaffList,
  resetActivationStatus,
  resetDeleteStatus,
  setListFilters,
  setListPagination,
} from "../../store/staffSlice";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
import Pagination from "../../components/common/pagination";
import Table from "../../components/common/table";
import StatCard from "../../components/dashboard/statCard";
import DashboardLayout from "../../components/layout/dashboardlayout";

import useAuth from "../../hooks/useAuth";
import useSearch from "../../hooks/useSearch";
import useSortTable from "../../hooks/useSortTable";
import { PAGINATION, ROUTES } from "../../utils/constants";

const Staff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // Redux state
  const {
    list: { items, status, error, pagination, filters },
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
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize search hook
  const { searchProps } = useSearch({
    initialQuery: filters.search || "",
    onSearch: (searchQuery) => {
      dispatch(setListFilters({ search: searchQuery }));
      loadStaffList();
    },
    debounceTime: 500,
  });

  // Initialize sort hook
  const { handleSort } = useSortTable({
    defaultSortField: "id",
    defaultDirection: "desc",
    serverSide: true,
    onSort: () => {
      // Implement server-side sorting here if needed
      loadStaffList();
    },
  });

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Load staff list on mount and when filters/pagination change
  useEffect(() => {
    loadStaffList();

    // Reset status when unmounting
    return () => {
      dispatch(resetDeleteStatus());
      dispatch(resetActivationStatus());
    };
  }, [dispatch]);

  // Show alerts when operations complete
  useEffect(() => {
    if (deleteSuccess) {
      setAlertConfig({
        open: true,
        message: "Staff member has been deleted successfully.",
        severity: "success",
      });
      setIsDeleteModalOpen(false);
      loadStaffList();
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
      loadStaffList();
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
      loadStaffList();
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
  ]);

  // Load staff list function
  const loadStaffList = () => {
    dispatch(
      fetchStaffList({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || "",
        is_active: filters.is_active,
      })
    );
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    dispatch(setListPagination({ page }));
    loadStaffList();
  };

  // Handle rows per page change
  const handleLimitChange = (limit) => {
    dispatch(setListPagination({ page: 1, limit }));
    loadStaffList();
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    dispatch(setListFilters({ is_active: e.target.value }));
    loadStaffList();
  };

  // Handle add staff
  const handleAddStaff = () => {
    navigate(ROUTES.ADD_STAFF);
  };

  // Handle edit staff
  const handleEditStaff = (staff) => {
    navigate(`${ROUTES.EDIT_STAFF.replace(":id", staff.id)}`);
  };

  // Handle delete staff
  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  // Handle staff status change
  const handleStatusClick = (staff, action) => {
    setSelectedStaff(staff);
    setStatusAction(action);
    setIsStatusModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (selectedStaff) {
      dispatch(deleteStaff(selectedStaff.id));
    }
  };

  // Handle status change confirmation
  const handleStatusConfirm = () => {
    if (selectedStaff) {
      if (statusAction === "activate") {
        dispatch(activateStaff(selectedStaff.id));
      } else if (statusAction === "deactivate") {
        dispatch(deactivateStaff(selectedStaff.id));
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadStaffList();
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  // Get staff stats
  const getActiveStaffCount = () => {
    return items.filter((staff) => staff.is_active).length;
  };

  const getInactiveStaffCount = () => {
    return items.filter((staff) => !staff.is_active).length;
  };

  // Table columns
  const columns = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      width: "70px",
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
      render: (value, row) => (
        <Box className="flex items-center">
          <Typography
            variant="body2"
            className="font-medium cursor-pointer hover:text-primary-600"
            onClick={() => handleEditStaff(row)}
          >
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "mobile_no",
      header: "Mobile",
    },
    {
      field: "department",
      header: "Department",
      render: (value) => value || "N/A",
    },
    {
      field: "is_active",
      header: "Status",
      sortable: true,
      render: (value) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      header: "Actions",
      align: "center",
      render: (_, row) => (
        <Box className="flex items-center justify-center space-x-1">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditStaff(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {row.is_active ? (
            <Tooltip title="Deactivate">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleStatusClick(row, "deactivate")}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleStatusClick(row, "activate")}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Staff Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage staff members for the complaint management system
          </Typography>
        </Box>

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

        {/* Stats Section */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Staff"
              value={pagination.total || 0}
              icon={<PersonIcon />}
              iconBgColor="bg-blue-500"
              loading={status === "loading"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Staff"
              value={getActiveStaffCount()}
              icon={<CheckCircleIcon />}
              iconBgColor="bg-green-500"
              loading={status === "loading"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Inactive Staff"
              value={getInactiveStaffCount()}
              icon={<CancelIcon />}
              iconBgColor="bg-gray-500"
              loading={status === "loading"}
            />
          </Grid>
        </Grid>

        {/* Filters and Actions */}
        <Box className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Box className="flex items-center gap-2">
            <TextField
              select
              label="Status"
              value={filters.is_active !== undefined ? filters.is_active : -1}
              onChange={handleFilterChange}
              size="small"
              className="min-w-[150px]"
            >
              <MenuItem value={-1}>All Status</MenuItem>
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </TextField>

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="flex items-center gap-4 w-full md:w-auto">
            <TextField
              {...searchProps}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search staff..."
              className="md:min-w-[300px]"
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStaff}
            >
              Add Staff
            </Button>
          </Box>
        </Box>

        {/* Staff Table */}
        <Card className="mb-4">
          <Table
            columns={columns}
            data={items}
            loading={status === "loading"}
            error={error}
            emptyMessage="No staff members found"
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
            Are you sure you want to delete {selectedStaff?.name}? This action
            cannot be undone.
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
            {selectedStaff?.name}?
            {statusAction === "deactivate" &&
              " The staff member will no longer be able to access the system."}
          </Typography>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default Staff;
