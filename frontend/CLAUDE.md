# Project: Employee CRUD App — Frontend

## Overview
A single-entity CRUD application for managing employee records.
Built as a teaching demo for full-stack web development students.

## Tech Stack
- **Framework:** React (Vite)
- **HTTP Client:** Axios
- **Dev Server Port:** 5173 (Vite default)
- **Backend API:** http://localhost:5001/api

## Project Structure
```
src/
  components/       # Reusable UI components
  pages/            # Page-level components
  services/         # Axios API call functions (one file per entity)
  App.jsx
  main.jsx
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

## API Conventions
- All API calls go through service files in `/src/services/` — never call Axios directly from a component
- Base URL: `http://localhost:5001/api`
- Expected endpoints:
  - GET    /api/employees
  - GET    /api/employees/:id
  - POST   /api/employees
  - PUT    /api/employees/:id
  - DELETE /api/employees/:id

## Code Style
- 2 spaces for indentation
- Semicolons required
- Verbose, descriptive variable and function names
- async/await only — no .then() chains
- Functional components only — no class components
- Comments on complex or non-obvious logic

## General Notes
- No authentication — all routes are public
- Keep components focused and single-purpose — this is a teaching codebase
- Avoid third-party UI libraries unless specifically requested