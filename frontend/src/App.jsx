import React, { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode.js';
import { useEmployees } from './hooks/useEmployees.js';
import { useSearch } from './hooks/useSearch.js';
import { Sun, Moon, Plus } from 'lucide-react';
import EmployeeTable from './components/EmployeeTable.jsx';
import SearchBar from './components/SearchBar.jsx';
import AddEmployeeDrawer from './components/AddEmployeeDrawer.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import './App.css';
import './styles/table.css';
import './styles/components.css';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, searchEmployees, clearError } = useEmployees();

  // Local state for UI components
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, employee: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search functionality using backend API
  const { searchTerm, isSearching, handleSearchChange, clearSearch } = useSearch(searchEmployees, 300);

  // Handle add employee
  const handleAddEmployee = async (employeeData) => {
    setIsSubmitting(true);
    try {
      await createEmployee(employeeData);
      setIsAddDrawerOpen(false);
    } catch (error) {
      console.error('Failed to add employee:', error);
      // Error is already handled by useEmployees hook and displayed to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = (employee) => {
    setDeleteConfirm({ isOpen: true, employee });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.employee) return;

    setIsDeleting(true);
    try {
      await deleteEmployee(deleteConfirm.employee.employee_id);
      setDeleteConfirm({ isOpen: false, employee: null });
    } catch (error) {
      console.error('Failed to delete employee:', error);
      // Error is already handled by useEmployees hook and displayed to user
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setDeleteConfirm({ isOpen: false, employee: null });
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">UT Austin Employee Management</h1>
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="main-content">
          {/* Top Controls */}
          <div className="top-controls">
            {/* Search Bar */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isSearching={isSearching}
              placeholder="Search employees by name or email..."
            />

            {/* Add Employee Button */}
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="add-employee-button"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={clearError} className="error-close">×</button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading employees...</p>
            </div>
          )}

          {/* Employee Table */}
          <EmployeeTable
            employees={employees}
            onUpdateEmployee={updateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            loading={loading}
            searchTerm={searchTerm}
          />
        </div>
      </main>

      {/* Add Employee Drawer */}
      <AddEmployeeDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSubmit={handleAddEmployee}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        employee={deleteConfirm.employee}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;