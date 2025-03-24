// src/hooks/useSortTable.js
import { useCallback, useMemo, useState } from "react";

/**
 * Custom hook for handling table sorting
 *
 * @param {Object} options - Sorting options
 * @param {Array} options.data - Array of data to sort
 * @param {string} options.defaultSortField - Default field to sort by
 * @param {string} options.defaultDirection - Default sort direction ('asc' or 'desc')
 * @param {Function} options.onSort - External sort handler (for server-side sorting)
 * @param {boolean} options.serverSide - Whether sorting is handled server-side (default: false)
 * @returns {Object} Sorting state and sorted data
 */
const useSortTable = ({
  data = [],
  defaultSortField = "",
  defaultDirection = "asc",
  onSort = null,
  serverSide = false,
}) => {
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: defaultSortField,
    direction: defaultDirection,
  });

  // Handle sort change
  const handleSort = useCallback(
    (field) => {
      setSortConfig((prevConfig) => {
        const newDirection =
          prevConfig.field === field && prevConfig.direction === "asc"
            ? "desc"
            : "asc";

        const newConfig = {
          field,
          direction: newDirection,
        };

        // Call external sort handler if provided (for server-side sorting)
        if (onSort && serverSide) {
          onSort(newConfig);
        }

        return newConfig;
      });
    },
    [onSort, serverSide]
  );

  // Reset sort to default
  const resetSort = useCallback(() => {
    const newConfig = {
      field: defaultSortField,
      direction: defaultDirection,
    };

    setSortConfig(newConfig);

    if (onSort && serverSide) {
      onSort(newConfig);
    }
  }, [defaultSortField, defaultDirection, onSort, serverSide]);

  // Sort data client-side if not server-side
  const sortedData = useMemo(() => {
    // If no data or no sort field, return original data
    if (!data || data.length === 0 || !sortConfig.field || serverSide) {
      return data;
    }

    // Make a copy of the data array to avoid mutating the original
    return [...data].sort((a, b) => {
      // Handle nested fields with dot notation (e.g., 'user.name')
      const fieldPath = sortConfig.field.split(".");

      // Extract values to compare
      let aValue = a;
      let bValue = b;

      for (const path of fieldPath) {
        aValue = aValue?.[path];
        bValue = bValue?.[path];
      }

      // Handle undefined or null values
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Handle other types (numbers, etc.)
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortConfig, serverSide]);

  // Generate props for table headers
  const getSortProps = useCallback(
    (field) => {
      return {
        onClick: () => handleSort(field),
        sorted: sortConfig.field === field,
        direction: sortConfig.field === field ? sortConfig.direction : null,
        className: `cursor-pointer select-none ${
          sortConfig.field === field ? "text-primary-600 font-semibold" : ""
        }`,
      };
    },
    [sortConfig, handleSort]
  );

  return {
    sortConfig,
    sortedData: serverSide ? data : sortedData,
    handleSort,
    resetSort,
    getSortProps,

    // Helpers for Material UI components
    getSortDirection: (field) =>
      sortConfig.field === field ? sortConfig.direction : false,
  };
};

export default useSortTable;
