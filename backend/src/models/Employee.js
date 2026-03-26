import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Employee model matching exact AWS RDS schema
const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name is required',
      },
      len: {
        args: [1, 100],
        msg: 'First name must be between 1 and 100 characters',
      },
    },
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name is required',
      },
      len: {
        args: [1, 100],
        msg: 'Last name must be between 1 and 100 characters',
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address',
      },
      len: {
        args: [1, 255],
        msg: 'Email must be between 1 and 255 characters',
      },
    },
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Must be a valid date',
      },
    },
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Salary must be a valid decimal number',
      },
      min: {
        args: [0],
        msg: 'Salary cannot be negative',
      },
    },
  },
  phone: {
    type: DataTypes.STRING(12),
    allowNull: true,
    validate: {
      len: {
        args: [0, 12],
        msg: 'Phone must be 12 characters or fewer',
      },
    },
  },
}, {
  tableName: 'employees',
  timestamps: false, // Assuming no created_at/updated_at columns
  underscored: true, // Use snake_case for auto-generated attributes
});

// IMPORTANT: Do NOT sync with force - this would destroy existing data
// The model will work with the existing table schema

export default Employee;