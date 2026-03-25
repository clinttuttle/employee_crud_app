# Employee Management System

A full-stack CRUD application for managing employee records, built as a teaching demonstration for modern web development practices.

## 🚀 Features

### ✨ Frontend Features
- **Responsive Employee Table** - View all employees with sortable columns
- **Inline Editing** - Click "Edit" to modify employee details directly in the table
- **Add Employee Drawer** - Slide-out form with validation for creating new employees
- **Real-time Search** - Fuzzy search across names and emails with backend integration
- **Delete Confirmation** - Secure deletion with detailed confirmation modal
- **Dark/Light Mode** - Theme toggle with localStorage persistence
- **Mobile Responsive** - Optimized for all device sizes

### 🔧 Backend Features
- **RESTful API** - Complete CRUD operations with proper HTTP status codes
- **Database Integration** - MySQL on AWS RDS with Sequelize ORM
- **Input Validation** - Comprehensive server-side validation
- **Error Handling** - Graceful error responses with meaningful messages
- **Fuzzy Search** - Backend-powered search across multiple fields

## 🏗️ Architecture

### Frontend Stack
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast development server with Hot Module Replacement
- **Axios** - HTTP client with interceptors for API communication
- **Lucide React** - Lightweight icon library
- **CSS Custom Properties** - Theme system for dark/light mode

### Backend Stack
- **Express.js** - Web framework for Node.js
- **Sequelize** - Modern ORM for MySQL
- **MySQL** - Database hosted on AWS RDS
- **ES Modules** - Modern JavaScript module system
- **CORS** - Cross-origin resource sharing configured

### Project Structure
```
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication layer
│   │   └── styles/          # CSS modules and themes
│   └── package.json
│
└── backend/                  # Express.js API server
    ├── src/
    │   ├── config/          # Database configuration
    │   ├── models/          # Sequelize models
    │   ├── controllers/     # Business logic
    │   └── routes/          # API route definitions
    ├── server.js            # Application entry point
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MySQL database (already configured for AWS RDS)

### Quick Start

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on: http://localhost:5001

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Application runs on: http://localhost:5173

3. **Open the Application**
   Navigate to http://localhost:5173 in your browser

## 🎯 Usage Guide

### Adding a New Employee
1. Click the **"Add Employee"** button in the top right
2. Fill in the required fields (First Name, Last Name, Email)
3. Optionally add Birthdate and Salary
4. Click **"Create Employee"** to save

### Editing an Employee
1. Find the employee in the table
2. Click the **"Edit"** button in the Actions column
3. Modify the fields directly in the table
4. Press **Enter** or click **"Save"** to confirm changes
5. Press **Escape** or click **"Cancel"** to discard changes

### Searching for Employees
1. Use the search bar at the top of the page
2. Type any part of a first name, last name, or email
3. Results filter automatically as you type
4. Click the **X** button to clear the search

### Deleting an Employee
1. Click the **"Delete"** button for an employee
2. Review the confirmation modal with employee details
3. Click **"Delete Employee"** to confirm (this cannot be undone)

### Dark Mode
- Click the sun/moon icon in the header to toggle between light and dark themes
- Your preference is automatically saved and restored on future visits

## 🛠️ API Endpoints

### Employee CRUD Operations
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update existing employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/search?q=<term>` - Search employees

### Example API Usage
```bash
# Get all employees
curl http://localhost:5001/api/employees

# Search employees
curl "http://localhost:5001/api/employees/search?q=john"

# Create new employee
curl -X POST http://localhost:5001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'
```

## 🎨 Design Principles

### Code Style
- **Clean Code** - Verbose, descriptive naming for educational clarity
- **Separation of Concerns** - Service layer, custom hooks, and component separation
- **Modern JavaScript** - ES modules, async/await, destructuring
- **Accessibility** - Keyboard navigation, ARIA labels, focus management
- **Responsive Design** - Mobile-first approach with progressive enhancement

### User Experience
- **Instant Feedback** - Loading states, optimistic updates, error handling
- **Intuitive Interface** - Clear visual hierarchy and consistent interactions
- **Performance** - Debounced search, skeleton loading, smooth animations
- **Error Recovery** - Graceful error handling with user-friendly messages

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Create a new employee with all fields
- [ ] Create a new employee with only required fields
- [ ] Edit an employee using inline editing
- [ ] Delete an employee and confirm it's removed
- [ ] Search for employees and verify results
- [ ] Toggle dark/light mode and verify persistence
- [ ] Test responsive design on mobile/tablet
- [ ] Verify all form validation works correctly

### Backend API Testing
```bash
# Health check
curl http://localhost:5001/health

# Test all CRUD operations
curl http://localhost:5001/api/employees
curl -X POST http://localhost:5001/api/employees -H "Content-Type: application/json" -d '{"first_name":"Test","last_name":"User","email":"test@test.com"}'
curl -X PUT http://localhost:5001/api/employees/1 -H "Content-Type: application/json" -d '{"first_name":"Updated","last_name":"User","email":"updated@test.com"}'
curl -X DELETE http://localhost:5001/api/employees/1
```

## 📝 Development Notes

### Database Schema
```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  birthdate DATE,
  salary DECIMAL(12,2)
);
```

### Environment Variables
Backend requires these environment variables in `.env`:


## 🚀 Deployment Considerations

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] CORS origins restricted to production domains
- [ ] Error logging and monitoring setup
- [ ] Build optimizations enabled
- [ ] SSL certificates configured
- [ ] Rate limiting and security headers added

### Performance Optimization
- Built with Vite for optimized production bundles
- CSS custom properties for efficient theme switching
- Debounced search to minimize API calls
- Optimistic UI updates for better perceived performance
- Lazy loading and code splitting ready for scaling

## 🎓 Learning Outcomes

This project demonstrates:
- **Full-stack development** with modern JavaScript frameworks
- **RESTful API design** with proper HTTP conventions
- **Database design** and ORM integration
- **React hooks** and modern component patterns
- **CSS theming** with custom properties
- **Form handling** and validation (client & server)
- **Error handling** and user experience design
- **Responsive design** and accessibility
- **Development workflow** with hot reloading and debugging

Perfect for learning modern web development practices! 🌟