import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService.js';

/**
 * Custom hook for managing employee data and CRUD operations
 */
export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new employee
  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.createEmployee(employeeData);

      // Add new employee to current list
      setEmployees(prevEmployees => [...prevEmployees, response.data]);

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing employee
  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.updateEmployee(id, employeeData);

      // Update employee in current list
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.employee_id === parseInt(id) ? response.data : emp
        )
      );

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete employee
  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await employeeService.deleteEmployee(id);

      // Remove employee from current list
      setEmployees(prevEmployees =>
        prevEmployees.filter(emp => emp.employee_id !== parseInt(id))
      );

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search employees
  const searchEmployees = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.searchEmployees(query);
      setEmployees(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to search employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    clearError,
  };
}