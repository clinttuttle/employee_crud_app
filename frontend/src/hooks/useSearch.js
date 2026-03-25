import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param {Function} searchFunction - Function to call when search is executed
 * @param {number} delay - Debounce delay in milliseconds (default: 300)
 */
export function useSearch(searchFunction, delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Execute search with debounce
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't search if no search function provided
    if (!searchFunction) {
      return;
    }

    // Set up debounced search
    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);

      try {
        await searchFunction(searchTerm);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, searchFunction, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    searchTerm,
    isSearching,
    handleSearchChange,
    clearSearch,
  };
}

/**
 * Alternative hook for immediate (non-debounced) search
 * @param {Function} searchFunction - Function to call when search is executed
 */
export function useInstantSearch(searchFunction) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Handle search input change and execute immediately
  const handleSearchChange = useCallback(async (value) => {
    setSearchTerm(value);

    if (!searchFunction) {
      return;
    }

    setIsSearching(true);

    try {
      await searchFunction(value);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchFunction]);

  // Clear search
  const clearSearch = useCallback(async () => {
    setSearchTerm('');

    if (!searchFunction) {
      return;
    }

    setIsSearching(true);

    try {
      await searchFunction('');
    } catch (error) {
      console.error('Clear search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchFunction]);

  return {
    searchTerm,
    isSearching,
    handleSearchChange,
    clearSearch,
  };
}