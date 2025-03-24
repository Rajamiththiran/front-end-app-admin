import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { formatDate, formatPhoneNumber } from "../../utils/formatters";
import Pagination from "../common/pagination";
import Table from "../common/table";

/**
 * Staff list component with search, filter, and pagination
 * @param {Object} props - Component props
 * @param {Array} props.staffs - List of staff members
 * @param {boolean} props.loading - Whether the list is in loading state
 * @param {function} props.onView - View handler
 * @param {function} props.onEdit - Edit handler
 * @param {function} props.onDelete - Delete handler
 * @param {function} props.onAdd - Add handler
 * @param {function} props.onActivate - Activate handler
 * @param {function} props.onDeactivate - Deactivate handler
 * @param {Object} props.pagination - Pagination props (page, limit, total)
 * @param {function} props.onPageChange - Page change handler
 * @param {function} props.onLimitChange - Page size change handler
 * @param {string} props.searchQuery - Search query
 * @param {function} props.onSearchChange - Search change handler
 * @param {number} props.activeFilter - Active filter value (-1: all, 0: inactive, 1: active)
 * @param {function} props.onActiveFilterChange - Active filter change handler
 */
const StaffList = ({
  staffs = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onActivate,
  onDeactivate,
  pagination = { page: 1, limit: 10, total: 0 },
  onPageChange,
  onLimitChange,
  searchQuery = "",
  onSearchChange,
  activeFilter = -1,
  onActiveFilterChange,
}) => {
  // Configure table columns
  const columns = [
    {
      field: "id_no",
      header: "Staff ID",
      sortable: true,
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "mobile_no",
      header: "Mobile",
      render: (value) => formatPhoneNumber(value),
    },
    {
      field: "department",
      header: "Department",
      sortable: true,
    },
    {
      field: "is_active",
      header: "Status",
      align: "center",
      render: (value) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "created_at",
      header: "Created",
      render: (value) => formatDate(value, "short"),
    },
    {
      field: "actions",
      header: "Actions",
      align: "center",
      render: (_, row) => (
        <Box className="flex justify-center">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={() => onView(row)}
              className="mx-1"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(row)}
              className="mx-1"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.is_active ? (
            <Tooltip title="Deactivate">
              <IconButton
                size="small"
                color="warning"
                onClick={() => onDeactivate(row)}
                className="mx-1"
              >
                <ToggleOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate">
              <IconButton
                size="small"
                color="success"
                onClick={() => onActivate(row)}
                className="mx-1"
              >
                <ToggleOnIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(row)}
              className="mx-1"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The search is already triggered by input change, but this prevents page reload
  };

  // Handle active filter change
  const handleActiveFilterChange = (e) => {
    if (onActiveFilterChange) {
      onActiveFilterChange(e.target.value);
    }
  };

  // Render table actions
  const renderTableActions = () => (
    <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <Box className="w-full sm:w-auto mb-3 sm:mb-0">
        <form onSubmit={handleSearchSubmit}>
          <TextField
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            className="min-w-[250px]"
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

      <Box className="flex items-center">
        <Box className="mr-2">
          <FormControl
            variant="outlined"
            size="small"
            className="min-w-[120px]"
          >
            <InputLabel id="active-filter-label">Status</InputLabel>
            <Select
              labelId="active-filter-label"
              value={activeFilter}
              onChange={handleActiveFilterChange}
              label="Status"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value={-1}>All</MenuItem>
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add Staff
        </Button>
      </Box>
    </Box>
  );

  // Render table pagination
  const renderPagination = () => (
    <Pagination
      count={Math.ceil(pagination.total / pagination.limit)}
      page={pagination.page}
      onChange={handlePageChange}
      showRowsPerPage
      rowsPerPage={pagination.limit}
      onRowsPerPageChange={handleLimitChange}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      total={pagination.total}
    />
  );

  return (
    <Paper className="p-4">
      <Box className="mb-4">
        <Typography variant="h6">Staff Management</Typography>
        <Typography variant="body2" color="textSecondary">
          Manage staff members, including department staff, faculty, and
          administrative personnel
        </Typography>
      </Box>

      <Table
        columns={columns}
        data={staffs}
        loading={loading}
        error={
          loading
            ? null
            : staffs.length === 0
            ? "No staff members found."
            : null
        }
        emptyMessage="No staff members found. Add a new staff member to get started."
        actions={renderTableActions()}
        pagination={renderPagination()}
      />
    </Paper>
  );
};

StaffList.propTypes = {
  staffs: PropTypes.array,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }),
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  activeFilter: PropTypes.number,
  onActiveFilterChange: PropTypes.func.isRequired,
};

export default StaffList;
