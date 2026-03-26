import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, Mail, Calendar, DollarSign, Phone } from 'lucide-react';

/**
 * Add Employee Drawer component with slide-out form
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {Function} onClose - Function to close the drawer
 * @param {Function} onSubmit - Function to handle form submission
 * @param {boolean} isSubmitting - Whether the form is being submitted
 */
function AddEmployeeDrawer({ isOpen, onClose, onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Refs for form management
  const firstNameRef = useRef(null);
  const drawerRef = useRef(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        birthdate: '',
        salary: '',
        phone: '',
      });
      setValidationErrors({});
      setTouched({});

      // Focus first input when drawer opens
      setTimeout(() => {
        if (firstNameRef.current) {
          firstNameRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle clicks outside the drawer to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (value.trim().length > 100) return 'First name must be less than 100 characters';
        return '';

      case 'last_name':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (value.trim().length > 100) return 'Last name must be less than 100 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        if (value.length > 255) return 'Email must be less than 255 characters';
        return '';

      case 'salary':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          return 'Salary must be a positive number';
        }
        return '';

      case 'phone':
        if (value && value.trim().length > 20) {
          return 'Phone number must be less than 20 characters';
        }
        return '';

      default:
        return '';
    }
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field and validate on change
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle input blur (mark field as touched)
  const handleInputBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur for better UX
    const error = validateField(name, formData[name]);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare form data for submission
      const submitData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        birthdate: formData.birthdate || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        phone: formData.phone ? formData.phone.trim() : null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Failed to create employee:', error);
      // Error handling is done in parent component
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay">
      <div ref={drawerRef} className="drawer add-employee-drawer">
        {/* Drawer Header */}
        <div className="drawer-header">
          <h2>Add New Employee</h2>
          <button
            onClick={onClose}
            className="drawer-close"
            disabled={isSubmitting}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          <form onSubmit={handleSubmit} className="add-employee-form">
            {/* First Name */}
            <div className="form-group">
              <label htmlFor="first_name" className="form-label required">
                <User size={16} />
                First Name
              </label>
              <input
                ref={firstNameRef}
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                onBlur={() => handleInputBlur('first_name')}
                className={`form-input ${validationErrors.first_name && touched.first_name ? 'error' : ''}`}
                placeholder="Enter first name"
                disabled={isSubmitting}
                maxLength={100}
              />
              {validationErrors.first_name && touched.first_name && (
                <span className="form-error">{validationErrors.first_name}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="last_name" className="form-label required">
                <User size={16} />
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                onBlur={() => handleInputBlur('last_name')}
                className={`form-input ${validationErrors.last_name && touched.last_name ? 'error' : ''}`}
                placeholder="Enter last name"
                disabled={isSubmitting}
                maxLength={100}
              />
              {validationErrors.last_name && touched.last_name && (
                <span className="form-error">{validationErrors.last_name}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label required">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleInputBlur('email')}
                className={`form-input ${validationErrors.email && touched.email ? 'error' : ''}`}
                placeholder="employee@company.com"
                disabled={isSubmitting}
                maxLength={255}
              />
              {validationErrors.email && touched.email && (
                <span className="form-error">{validationErrors.email}</span>
              )}
            </div>

            {/* Birthdate */}
            <div className="form-group">
              <label htmlFor="birthdate" className="form-label">
                <Calendar size={16} />
                Birthdate
              </label>
              <input
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                onBlur={() => handleInputBlur('birthdate')}
                className="form-input"
                disabled={isSubmitting}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
              <span className="form-help">Optional: Employee's date of birth</span>
            </div>

            {/* Salary */}
            <div className="form-group">
              <label htmlFor="salary" className="form-label">
                <DollarSign size={16} />
                Annual Salary
              </label>
              <input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                onBlur={() => handleInputBlur('salary')}
                className={`form-input ${validationErrors.salary && touched.salary ? 'error' : ''}`}
                placeholder="0.00"
                disabled={isSubmitting}
                min="0"
                step="0.01"
              />
              {validationErrors.salary && touched.salary && (
                <span className="form-error">{validationErrors.salary}</span>
              )}
              <span className="form-help">Optional: Annual salary in USD</span>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                className={`form-input ${validationErrors.phone && touched.phone ? 'error' : ''}`}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
                maxLength={20}
              />
              {validationErrors.phone && touched.phone && (
                <span className="form-error">{validationErrors.phone}</span>
              )}
              <span className="form-help">Optional: Employee's phone number</span>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployeeDrawer;