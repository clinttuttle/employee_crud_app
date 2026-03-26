import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EmployeeRow from './EmployeeRow.jsx';

/**
 * Employee table component with sorting functionality
 * @param {Array} employees - Array of employee objects
 * @param {Function} onUpdateEmployee - Function to update an employee
 * @param {Function} onDeleteEmployee - Function to delete an employee
 * @param {boolean} loading - Whether data is loading
 * @param {string} searchTerm - Current search term for no results message
 */
function EmployeeTable({ employees, onUpdateEmployee, onDeleteEmployee, loading, searchTerm }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle column sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort employees based on current sort configuration
  const sortedEmployees = React.useMemo(() => {
    if (!sortConfig.key) {
      return employees;
    }

    return [...employees].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      if (bValue === null || bValue === undefined) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }

      // Handle different data types
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        // Convert to string for comparison
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [employees, sortConfig]);

  // Render sort icon for column headers
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon inactive">⇅</span>;
    }

    return sortConfig.direction === 'asc' ?
      <ChevronUp className="sort-icon active" size={16} /> :
      <ChevronDown className="sort-icon active" size={16} />;
  };

  if (loading) {
    return (
      <div className="employee-table-container">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="employee-table-container">
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th
                className="sortable"
                onClick={() => handleSort('employee_id')}
              >
                ID {renderSortIcon('employee_id')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('first_name')}
              >
                First Name {renderSortIcon('first_name')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('last_name')}
              >
                Last Name {renderSortIcon('last_name')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('email')}
              >
                Email {renderSortIcon('email')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('birthdate')}
              >
                Birthdate {renderSortIcon('birthdate')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('salary')}
              >
                Salary {renderSortIcon('salary')}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('phone')}
              >
                Phone {renderSortIcon('phone')}
              </th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-employees">
                  {searchTerm ?
                    `No employees found matching "${searchTerm}".` :
                    'No employees found. Click "Add Employee" to get started.'
                  }
                </td>
              </tr>
            ) : (
              sortedEmployees.map(employee => (
                <EmployeeRow
                  key={employee.employee_id}
                  employee={employee}
                  onUpdate={onUpdateEmployee}
                  onDelete={onDeleteEmployee}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {sortedEmployees.length > 0 && (
        <div className="table-footer">
          <p className="employee-count">
            {sortedEmployees.length} employee{sortedEmployees.length !== 1 ? 's' : ''}
            {searchTerm ? ` matching "${searchTerm}"` : ' total'}
          </p>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;