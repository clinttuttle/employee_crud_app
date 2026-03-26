# Project: Employee CRUD App — Backend

## Overview
REST API for a single-entity CRUD application managing employee records.
Built as a teaching demo for full-stack web development students.

## Tech Stack
- **Server:** Express
- **ORM:** Sequelize
- **Database:** MySQL hosted on AWS RDS
- **Module System:** ES Modules (import/export)
- **Port:** 5001

## Project Structure
```
src/
  config/
    db.js           # Sequelize connection instance
  models/
    Employee.js     # Sequelize model definition
  routes/
    employeeRoutes.js
  controllers/
    employeeController.js
server.js           # Express app entry point
.env                # DB credentials (never commit this)
```

## Data Entity: Employee
| Field       | Type           | Notes              |
|-------------|----------------|--------------------|
| employee_id | int            | PK, auto-increment |
| first_name  | varchar(100)   | Required           |
| last_name   | varchar(100)   | Required           |
| email       | varchar(255)   | Required, unique   |
| birthdate   | date           | Optional           |
| salary      | decimal(12,2)  | Optional           |
| phone       | varchar(12)    | Optional           |


## Database
- MySQL on AWS RDS
- Sequelize should match the existing schema — do NOT use `sync({ force: true })` or alter the table
- Store DB credentials in `.env` using the following keys:
  - DB_HOST
  - DB_PORT
  - DB_NAME
  - DB_USER
  - DB_PASS

## API Conventions
- All routes prefixed with `/api`
- Follow REST conventions (GET, POST, PUT, DELETE)
- Controllers handle all business logic — keep routes thin
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Always return JSON responses

## Code Style
- 2 spaces for indentation
- Semicolons required
- Verbose, descriptive variable and function names
- async/await only — no .then() chains
- Comments on complex or non-obvious logic

## General Notes
- No authentication — all routes are public
- This is a teaching codebase — prioritize clarity and simplicity over cleverness
- Never commit .env — ensure it is in .gitignore