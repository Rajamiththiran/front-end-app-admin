import {
  Box,
  CircularProgress,
  Table as MuiTable,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Table component that wraps Material UI Table with additional features
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Whether table is loading
 * @param {boolean} props.error - Error message if any
 * @param {string} props.emptyMessage - Message to display when table is empty
 * @param {Object} props.sort - Sort configuration { field, direction }
 * @param {function} props.onSort - Sort handler
 * @param {React.ReactNode} props.pagination - Pagination component
 * @param {string} props.className - Additional Tailwind classes
 * @param {React.ReactNode} props.actions - Table actions (buttons, etc.)
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  error = "",
  emptyMessage = "No data available",
  sort = { field: "", direction: "asc" },
  onSort,
  pagination,
  className = "",
  actions,
  ...props
}) => {
  const handleSort = (field) => {
    if (onSort) {
      const direction =
        sort.field === field && sort.direction === "asc" ? "desc" : "asc";
      onSort({ field, direction });
    }
  };

  return (
    <Box className={className}>
      {actions && (
        <Box className="flex justify-end space-x-2 mb-4">{actions}</Box>
      )}

      <TableContainer component={Paper} className="shadow-sm">
        <MuiTable {...props}>
          <TableHead className="bg-gray-50">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  className={`font-semibold ${column.className || ""}`}
                  style={{ minWidth: column.minWidth, ...column.style }}
                >
                  {onSort && column.sortable !== false ? (
                    <TableSortLabel
                      active={sort.field === column.field}
                      direction={
                        sort.field === column.field ? sort.direction : "asc"
                      }
                      onClick={() => handleSort(column.field)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  className="py-12"
                >
                  <CircularProgress size={40} />
                  <Typography variant="body2" className="mt-2 text-gray-600">
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  className="py-8 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  className="py-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  hover
                  className="hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowIndex}-${column.field}`}
                      align={column.align || "left"}
                      className={column.cellClassName || ""}
                    >
                      {column.render
                        ? column.render(row[column.field], row)
                        : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {pagination && !loading && data.length > 0 && (
        <Box className="mt-4">{pagination}</Box>
      )}
    </Box>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      render: PropTypes.func,
      align: PropTypes.oneOf(["left", "center", "right"]),
      sortable: PropTypes.bool,
      className: PropTypes.string,
      cellClassName: PropTypes.string,
      minWidth: PropTypes.number,
      style: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  sort: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSort: PropTypes.func,
  pagination: PropTypes.node,
  className: PropTypes.string,
  actions: PropTypes.node,
};

export default Table;
