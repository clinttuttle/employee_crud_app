import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Delete confirmation modal component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Object} employee - Employee object to delete
 * @param {Function} onConfirm - Function to call when delete is confirmed
 * @param {Function} onCancel - Function to call when delete is cancelled
 * @param {boolean} isDeleting - Whether the deletion is in progress
 */
function DeleteConfirmModal({ isOpen, employee, onConfirm, onCancel, isDeleting = false }) {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Focus confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!isDeleting) {
          onCancel();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onCancel, isDeleting]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || isDeleting) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onCancel();
          break;
        case 'Enter':
          event.preventDefault();
          onConfirm();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onConfirm, onCancel, isDeleting]);

  // Don't render if not open or no employee
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal delete-confirm-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <AlertTriangle className="warning-icon" size={24} />
            <h2>Confirm Delete</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <div className="delete-warning">
            <p className="primary-message">
              Are you sure you want to delete{' '}
              <strong>
                {employee.first_name} {employee.last_name}
              </strong>
              ?
            </p>

            <div className="employee-details">
              <p><strong>Email:</strong> {employee.email}</p>
              {employee.birthdate && (
                <p><strong>Birthdate:</strong> {new Date(employee.birthdate).toLocaleDateString()}</p>
              )}
              {employee.salary && (
                <p><strong>Salary:</strong> ${parseFloat(employee.salary).toLocaleString()}</p>
              )}
            </div>

            <p className="warning-text">
              <AlertTriangle size={16} />
              This action cannot be undone. All employee data will be permanently removed.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isDeleting}
            type="button"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="btn btn-danger delete-confirm-button"
            disabled={isDeleting}
            type="button"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;