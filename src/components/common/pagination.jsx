import {
  Box,
  FormControl,
  MenuItem,
  Pagination as MuiPagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Pagination component that wraps Material UI Pagination with additional features
 * @param {Object} props - Component props
 * @param {number} props.count - Total number of pages
 * @param {number} props.page - Current page
 * @param {function} props.onChange - Page change handler
 * @param {boolean} props.showRowsPerPage - Whether to show rows per page selector
 * @param {number} props.rowsPerPage - Current rows per page value
 * @param {function} props.onRowsPerPageChange - Rows per page change handler
 * @param {Array<number>} props.rowsPerPageOptions - Available rows per page options
 * @param {number} props.total - Total number of items (for displaying count)
 * @param {string} props.size - Pagination size: 'small', 'medium', 'large'
 * @param {string} props.color - Pagination color: 'primary', 'secondary', 'standard'
 * @param {string} props.className - Additional Tailwind classes
 */
const Pagination = ({
  count,
  page,
  onChange,
  showRowsPerPage = false,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  total = 0,
  size = "medium",
  color = "primary",
  className = "",
  ...props
}) => {
  const handleChange = (event, value) => {
    onChange(value);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event.target.value);
  };

  // Calculate the current range of items showing
  const from = Math.min((page - 1) * rowsPerPage + 1, total);
  const to = Math.min(page * rowsPerPage, total);

  return (
    <Box
      className={`flex flex-col sm:flex-row justify-between items-center w-full py-4 ${className}`}
    >
      {total > 0 && (
        <Typography variant="body2" className="text-gray-600 mb-4 sm:mb-0">
          Showing {from} to {to} of {total} entries
        </Typography>
      )}

      <Stack spacing={2} direction="row" alignItems="center">
        {showRowsPerPage && onRowsPerPageChange && (
          <Box className="flex items-center">
            <Typography variant="body2" className="mr-2 text-gray-600">
              Rows per page:
            </Typography>
            <FormControl size="small">
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                variant="outlined"
                size="small"
                className="min-w-[80px]"
              >
                {rowsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <MuiPagination
          count={count}
          page={page}
          onChange={handleChange}
          size={size}
          color={color}
          shape="rounded"
          showFirstButton
          showLastButton
          {...props}
        />
      </Stack>
    </Box>
  );
};

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  showRowsPerPage: PropTypes.bool,
  rowsPerPage: PropTypes.number,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  total: PropTypes.number,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["primary", "secondary", "standard"]),
  className: PropTypes.string,
};

export default Pagination;
