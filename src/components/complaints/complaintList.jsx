// src/components/complaints/complaintList.jsx
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { COMPLAINT_STATUS } from "../../utils/constants";
import { formatTimeAgo } from "../../utils/formatters";
import Pagination from "../common/pagination";
import Table from "../common/table";

/**
 * Complaint list component with filtering, sorting, and pagination
 * @param {Object} props - Component props
 * @param {Array} props.complaints - Array of complaint objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Object} props.pagination - Pagination configuration
 * @param {number} props.pagination.page - Current page
 * @param {number} props.pagination.limit - Items per page
 * @param {number} props.pagination.total - Total number of items
 * @param {Function} props.onView - Handler for viewing a complaint
 * @param {Function} props.onAssign - Handler for assigning a complaint
 * @param {Function} props.onDrop - Handler for dropping a complaint
 * @param {Function} props.onPageChange - Handler for page change
 * @param {Function} props.onLimitChange - Handler for items per page change
 * @param {Function} props.onStatusFilterChange - Handler for status filter change
 * @param {Function} props.onSearchChange - Handler for search query change
 * @param {Function} props.onRefresh - Handler for refreshing the data
 * @param {string} props.statusFilter - Current status filter value
 * @param {string} props.searchQuery - Current search query
 */
const ComplaintList = ({
  complaints = [],
  loading = false,
  error = null,
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
  },
  onView,
  onAssign,
  onDrop,
  onPageChange,
  onLimitChange,
  onStatusFilterChange,
  onSearchChange,
  onRefresh,
  statusFilter = "",
  searchQuery = "",
}) => {
  // Get color for status chip
  const getStatusColor = (status) => {
    switch (status) {
      case COMPLAINT_STATUS.PENDING:
        return "warning";
      case COMPLAINT_STATUS.ASSIGNED:
        return "info";
      case COMPLAINT_STATUS.IN_PROGRESS:
        return "primary";
      case COMPLAINT_STATUS.COMPLETED:
        return "success";
      case COMPLAINT_STATUS.DROPPED:
        return "error";
      default:
        return "default";
    }
  };

  // Format status text for display
  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  // Columns configuration for the table
  const columns = [
    {
      field: "id",
      header: "ID",
      minWidth: 70,
      render: (value) => `#${value}`,
    },
    {
      field: "title",
      header: "Title",
      minWidth: 200,
      render: (value, row) => (
        <Typography
          variant="body2"
          className="font-medium cursor-pointer hover:text-primary-600"
          onClick={() => onView(row)}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "subject",
      header: "Subject",
      minWidth: 150,
    },
    {
      field: "students",
      header: "Student",
      minWidth: 150,
      render: (value) => value?.name || "N/A",
    },
    {
      field: "status",
      header: "Status",
      minWidth: 130,
      render: (value) => (
        <Chip
          label={formatStatus(value)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      field: "staffs",
      header: "Assigned To",
      minWidth: 150,
      render: (value) => value?.name || "Not Assigned",
    },
    {
      field: "created_at",
      header: "Created",
      minWidth: 120,
      render: (value) => formatTimeAgo(value),
    },
    {
      field: "actions",
      header: "Actions",
      align: "center",
      minWidth: 120,
      render: (_, row) => (
        <Box className="flex items-center justify-center space-x-1">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onView(row)}
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
                  onClick={() => onAssign(row)}
                >
                  <AssignmentIndIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Drop Complaint">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDrop(row)}
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

  // Handle search input change
  const handleSearchInputChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Prevent page refresh, the search is already triggered by input change
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(e.target.value);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Render table actions (filter, search, etc.)
  const renderTableActions = () => (
    <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
      <Box className="flex items-center gap-2">
        <FormControl size="small" variant="outlined" className="min-w-[150px]">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value={COMPLAINT_STATUS.PENDING}>Pending</MenuItem>
            <MenuItem value={COMPLAINT_STATUS.ASSIGNED}>Assigned</MenuItem>
            <MenuItem value={COMPLAINT_STATUS.IN_PROGRESS}>
              In Progress
            </MenuItem>
            <MenuItem value={COMPLAINT_STATUS.COMPLETED}>Completed</MenuItem>
            <MenuItem value={COMPLAINT_STATUS.DROPPED}>Dropped</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box className="w-full sm:w-auto">
        <form onSubmit={handleSearchSubmit}>
          <TextField
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            variant="outlined"
            size="small"
            className="min-w-[250px] w-full sm:w-auto"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );

  // Render pagination
  const renderPagination = () => (
    <Pagination
      count={Math.ceil(pagination.total / pagination.limit)}
      page={pagination.page}
      onChange={onPageChange}
      rowsPerPage={pagination.limit}
      onRowsPerPageChange={onLimitChange}
      showRowsPerPage
      total={pagination.total}
    />
  );

  return (
    <Box className="w-full">
      <Table
        columns={columns}
        data={complaints}
        loading={loading}
        error={error}
        emptyMessage="No complaints found matching your criteria."
        actions={renderTableActions()}
        pagination={renderPagination()}
      />
    </Box>
  );
};

ComplaintList.propTypes = {
  complaints: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }),
  onView: PropTypes.func.isRequired,
  onAssign: PropTypes.func,
  onDrop: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onStatusFilterChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  onRefresh: PropTypes.func,
  statusFilter: PropTypes.string,
  searchQuery: PropTypes.string,
};

export default ComplaintList;
