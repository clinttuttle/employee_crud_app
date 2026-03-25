import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} from '../controllers/employeeController.js';

const router = express.Router();

// Routes for employee CRUD operations
// Order matters - more specific routes should come before parameterized ones

// GET /api/employees/search?q=<term> - Search employees by name or email
router.get('/search', searchEmployees);

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// GET /api/employees/:id - Get single employee by ID
router.get('/:id', getEmployeeById);

// POST /api/employees - Create new employee
router.post('/', createEmployee);

// PUT /api/employees/:id - Update existing employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', deleteEmployee);

export default router;