import { Op } from 'sequelize';
import Employee from '../models/Employee.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [['employee_id', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, birthdate, salary, phone } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required',
      });
    }

    // Create employee object with provided data
    const employeeData = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
    };

    // Add optional fields if provided
    if (birthdate) {
      employeeData.birthdate = birthdate;
    }

    if (salary !== undefined && salary !== null && salary !== '') {
      employeeData.salary = parseFloat(salary);
    }

    if (phone !== undefined && phone !== null && phone !== '') {
      employeeData.phone = phone.trim();
    }

    const newEmployee = await Employee.create(employeeData);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);

    // Handle unique constraint violation for email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use',
      });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// Update existing employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, birthdate, salary, phone } = req.body;

    // Validate ID is a number
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    // Find employee first
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
    }

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required',
      });
    }

    // Prepare update data
    const updateData = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      birthdate: birthdate || null,
      salary: (salary !== undefined && salary !== null && salary !== '') ? parseFloat(salary) : null,
      phone: (phone !== undefined && phone !== null && phone !== '') ? phone.trim() : null,
    };

    const updatedEmployee = await employee.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);

    // Handle unique constraint violation for email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use',
      });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    // Find employee first
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`,
      });
    }

    // Store employee data before deletion for response
    const deletedEmployeeData = { ...employee.toJSON() };

    await employee.destroy();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: deletedEmployeeData,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

// Fuzzy search employees by first name, last name, or email
export const searchEmployees = async (req, res) => {
  try {
    const { q } = req.query;

    // If no search query provided, return all employees
    if (!q || q.trim() === '') {
      return getAllEmployees(req, res);
    }

    const searchTerm = q.trim();

    // Fuzzy search across first_name, last_name, and email
    const employees = await Employee.findAll({
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          {
            last_name: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
        ],
      },
      order: [['employee_id', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: employees,
      count: employees.length,
      searchTerm: searchTerm,
    });
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search employees',
      error: error.message,
    });
  }
};