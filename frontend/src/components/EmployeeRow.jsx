import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Save, X, Trash2 } from 'lucide-react';

/**
 * Individual employee table row component with inline editing
 * @param {Object} employee - Employee data object
 * @param {Function} onUpdate - Function to call when employee is updated
 * @param {Function} onDelete - Function to call when employee should be deleted
 */
function EmployeeRow({ employee, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Refs for input focus management
  const firstNameRef = useRef(null);

  // Initialize edit data when employee changes or editing starts
  useEffect(() => {
    if (employee) {
      setEditData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        birthdate: employee.birthdate || '',
        salary: employee.salary || '',
        phone: employee.phone || '',
      });
    }
  }, [employee, isEditing]);

  // Focus first input when entering edit mode
  useEffect(() => {
    if (isEditing && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isEditing]);

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!editData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!editData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!editData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (editData.salary && (isNaN(editData.salary) || parseFloat(editData.salary) < 0)) {
      errors.salary = 'Salary must be a positive number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Enter edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setValidationErrors({});
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
    // Reset edit data to original values
    setEditData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      birthdate: employee.birthdate || '',
      salary: employee.salary || '',
      phone: employee.phone || '',
    });
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(employee.employee_id, editData);
      setIsEditing(false);
      setValidationErrors({});
    } catch (error) {
      console.error('Failed to update employee:', error);
      // You could show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary || salary === 'null') return '-';
    const numSalary = parseFloat(salary);
    return isNaN(numSalary) ? '-' : `$${numSalary.toLocaleString()}`;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date || date === 'null') return '-';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  if (isEditing) {
    return (
      <tr className="employee-row editing">
        <td>{employee.employee_id}</td>
        <td>
          <input
            ref={firstNameRef}
            type="text"
            value={editData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input ${validationErrors.first_name ? 'error' : ''}`}
            placeholder="First name"
          />
          {validationErrors.first_name && (
            <span className="error-text">{validationErrors.first_name}</span>
          )}
        </td>
        <td>
          <input
            type="text"
            value={editData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input ${validationErrors.last_name ? 'error' : ''}`}
            placeholder="Last name"
          />
          {validationErrors.last_name && (
            <span className="error-text">{validationErrors.last_name}</span>
          )}
        </td>
        <td>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input ${validationErrors.email ? 'error' : ''}`}
            placeholder="email@example.com"
          />
          {validationErrors.email && (
            <span className="error-text">{validationErrors.email}</span>
          )}
        </td>
        <td>
          <input
            type="date"
            value={editData.birthdate}
            onChange={(e) => handleInputChange('birthdate', e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-input"
          />
        </td>
        <td>
          <input
            type="number"
            value={editData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            onKeyDown={handleKeyDown}
            className={`edit-input ${validationErrors.salary ? 'error' : ''}`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {validationErrors.salary && (
            <span className="error-text">{validationErrors.salary}</span>
          )}
        </td>
        <td>
          <input
            type="tel"
            value={editData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-input"
            placeholder="(555) 123-4567"
          />
        </td>
        <td>
          <div className="edit-actions">
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className="action-button save"
              title="Save changes (Enter)"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="action-button cancel"
              title="Cancel editing (Escape)"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="employee-row">
      <td>{employee.employee_id}</td>
      <td>{employee.first_name}</td>
      <td>{employee.last_name}</td>
      <td>{employee.email}</td>
      <td>{formatDate(employee.birthdate)}</td>
      <td>{formatSalary(employee.salary)}</td>
      <td>{employee.phone || '-'}</td>
      <td>
        <div className="row-actions">
          <button
            onClick={handleEditClick}
            className="action-button edit"
            title="Edit employee"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="action-button delete"
            title="Delete employee"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default EmployeeRow;