import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './src/config/db.js';
import employeeRoutes from './src/routes/employeeRoutes.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow frontend on localhost:5173
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee CRUD API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/employees', employeeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee CRUD API',
    version: '1.0.0',
    documentation: {
      endpoints: {
        'GET /api/employees': 'Get all employees',
        'GET /api/employees/search?q=<term>': 'Search employees by name or email',
        'GET /api/employees/:id': 'Get single employee by ID',
        'POST /api/employees': 'Create new employee',
        'PUT /api/employees/:id': 'Update existing employee',
        'DELETE /api/employees/:id': 'Delete employee',
        'GET /health': 'Health check',
      },
    },
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Default error response
  const errorResponse = {
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  };

  res.status(error.status || 500).json(errorResponse);
});

// Start server function
const startServer = async () => {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const connectionSuccess = await testConnection();

    if (!connectionSuccess) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      console.log('🚀 Employee CRUD API Server Started');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API endpoints: http://localhost:${PORT}/api/employees`);
      console.log(`🔍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  process.exit(0);
});

// Start the server
startServer();