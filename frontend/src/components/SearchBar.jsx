import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search bar component with debounced input and clear functionality
 * @param {string} searchTerm - Current search term
 * @param {Function} onSearchChange - Function to call when search term changes
 * @param {Function} onClearSearch - Function to call when search is cleared
 * @param {boolean} isSearching - Whether a search is in progress
 * @param {string} placeholder - Placeholder text for the input
 */
function SearchBar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  isSearching = false,
  placeholder = "Search employees..."
}) {
  const inputRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  // Handle clear search
  const handleClear = () => {
    onClearSearch();
    // Focus back on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search
          className="search-icon"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
        />
        {isSearching && (
          <div className="search-spinner">
            <div className="spinner"></div>
          </div>
        )}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="clear-search-button"
            title="Clear search (Escape)"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-results-info">
          Searching for "{searchTerm}"
          {isSearching && " ..."}
        </div>
      )}
    </div>
  );
}

export default SearchBar;