import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Extract meaningful error message
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'An unexpected error occurred';

    // Log error for debugging
    console.error('API Error:', errorMessage, error.response?.data);

    // Throw formatted error
    throw new Error(errorMessage);
  }
);

// Employee service functions
export const employeeService = {
  /**
   * Get all employees
   * @returns {Promise<Object>} Response with employees data
   */
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }
  },

  /**
   * Get single employee by ID
   * @param {number|string} id - Employee ID
   * @returns {Promise<Object>} Response with employee data
   */
  async getEmployeeById(id) {
    try {
      if (!id) {
        throw new Error('Employee ID is required');
      }

      const response = await api.get(`/employees/${id}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch employee: ${error.message}`);
    }
  },

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @param {string} employeeData.first_name - First name (required)
   * @param {string} employeeData.last_name - Last name (required)
   * @param {string} employeeData.email - Email (required)
   * @param {string} [employeeData.birthdate] - Birthdate (optional)
   * @param {number|string} [employeeData.salary] - Salary (optional)
   * @returns {Promise<Object>} Response with created employee data
   */
  async createEmployee(employeeData) {
    try {
      // Validate required fields
      if (!employeeData.first_name || !employeeData.last_name || !employeeData.email) {
        throw new Error('First name, last name, and email are required');
      }

      const response = await api.post('/employees', employeeData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }
  },

  /**
   * Update existing employee
   * @param {number|string} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>} Response with updated employee data
   */
  async updateEmployee(id, employeeData) {
    try {
      if (!id) {
        throw new Error('Employee ID is required');
      }

      // Validate required fields
      if (!employeeData.first_name || !employeeData.last_name || !employeeData.email) {
        throw new Error('First name, last name, and email are required');
      }

      const response = await api.put(`/employees/${id}`, employeeData);
      return response;
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  },

  /**
   * Delete employee
   * @param {number|string} id - Employee ID
   * @returns {Promise<Object>} Response confirming deletion
   */
  async deleteEmployee(id) {
    try {
      if (!id) {
        throw new Error('Employee ID is required');
      }

      const response = await api.delete(`/employees/${id}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  },

  /**
   * Search employees by name or email
   * @param {string} query - Search query
   * @returns {Promise<Object>} Response with matching employees
   */
  async searchEmployees(query) {
    try {
      // If no query, return all employees
      if (!query || query.trim() === '') {
        return this.getAllEmployees();
      }

      const response = await api.get(`/employees/search?q=${encodeURIComponent(query.trim())}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to search employees: ${error.message}`);
    }
  },
};

export default employeeService;