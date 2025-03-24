// src/hooks/useSearch.js
import { useCallback, useEffect, useState } from "react";
import { debounce } from "../utils/helpers";

/**
 * Custom hook for handling search functionality
 *
 * @param {Object} options - Search options
 * @param {Function} options.onSearch - Function to call when search query changes
 * @param {string} options.initialQuery - Initial search query (default: '')
 * @param {number} options.debounceTime - Debounce time in milliseconds (default: 500)
 * @param {boolean} options.searchOnMount - Whether to trigger search on mount (default: false)
 * @returns {Object} Search state and control methods
 */
const useSearch = ({
  onSearch,
  initialQuery = "",
  debounceTime = 500,
  searchOnMount = false,
}) => {
  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!onSearch) return;

      setIsSearching(true);
      setSearchError(null);

      try {
        await onSearch(searchQuery);
      } catch (error) {
        setSearchError(error.message || "Search failed");
      } finally {
        setIsSearching(false);
      }
    }, debounceTime),
    [onSearch, debounceTime]
  );

  // Handle search query changes
  const handleSearch = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    debouncedSearch("");
  }, [debouncedSearch]);

  // Perform search on mount if enabled
  useEffect(() => {
    if (searchOnMount && initialQuery) {
      debouncedSearch(initialQuery);
    }
  }, [searchOnMount, initialQuery, debouncedSearch]);

  // Cleanup function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    query,
    isSearching,
    searchError,
    handleSearch,
    clearSearch,

    // For direct input binding
    searchProps: {
      value: query,
      onChange: (e) => handleSearch(e.target.value),
      placeholder: "Search...",
    },
  };
};

export default useSearch;
