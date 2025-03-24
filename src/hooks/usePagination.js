// src/hooks/usePagination.js
import { useCallback, useEffect, useState } from "react";
import { PAGINATION } from "../utils/constants";

/**
 * Custom hook for handling pagination
 *
 * @param {Object} options - Pagination options
 * @param {Function} options.fetchData - Function to fetch data (should accept pagination params)
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.initialLimit - Initial items per page (default: 10)
 * @param {Object} options.initialFilters - Initial filter values (default: {})
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount (default: true)
 * @returns {Object} Pagination state and control methods
 */
const usePagination = ({
  fetchData,
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialLimit = PAGINATION.DEFAULT_LIMIT,
  initialFilters = {},
  autoFetch = true,
}) => {
  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Method to fetch data with current pagination state
  const fetchPaginatedData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare request parameters
      const params = {
        page,
        limit,
        ...filters,
      };

      // Call the fetchData function with params
      const response = await fetchData(params);

      // Update state with response data
      setData(response.data || []);
      setTotal(response.totalCount || 0);
      setTotalPages(
        response.totalPages || Math.ceil((response.totalCount || 0) / limit)
      );

      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, limit, filters]);

  // Change page
  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Change rows per page
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1); // Reset to first page when filters are reset
  }, [initialFilters]);

  // Reset all pagination state
  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setFilters(initialFilters);
  }, [initialPage, initialLimit, initialFilters]);

  // Fetch data when pagination changes
  useEffect(() => {
    if (autoFetch || loading) {
      fetchPaginatedData();
    }
  }, [fetchPaginatedData, autoFetch]);

  // Calculate pagination info
  const paginationInfo = {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    startItem: total === 0 ? 0 : (page - 1) * limit + 1,
    endItem: Math.min(page * limit, total),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return {
    // Data
    data,
    loading,
    error,

    // State
    page,
    limit,
    filters,
    total,
    totalPages,
    paginationInfo,

    // Methods
    goToPage,
    changeLimit,
    updateFilters,
    resetFilters,
    resetPagination,
    fetchPaginatedData,

    // Row selection (optional)
    selectedRows: [],
    setSelectedRows: () => {}, // Placeholder - implement if needed
  };
};

export default usePagination;
