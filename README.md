# Notes App — Full Stack MERN Application

A full-stack Notes Application built with Node.js, Express, MongoDB Atlas, and React (Vite). It enables users to register, log in, and manage their personal notes securely.

## Features

- **User Authentication**: Signup and login with bcrypt password hashing and JWT token authorization.
- **Notes Management**: Create, read, update, and delete user-scoped notes with real-time title and content search filtering.
- **User Interface**: Responsive React single-page app with sticky navigation bar, user profile dropdown menu, and modal dialogs.
- **Logging & Error Handling**: Pino HTTP request/error logger and centralized Express error handling middleware.
- **Unit Testing**: Mocha and Chai backend test suite (15 unit tests passing with 98.57% code coverage).

## Project Structure

```
cohort-9-mern-6888-muqadas/
├── backend/            # Express server, MongoDB models, auth & note controllers, tests
└── frontend/           # React 19 + Vite application, AuthContext, components, pages
```

## Getting Started (Local Execution)

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Run the Backend Server
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:5000`.

### 2. Run the Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your web browser.

## Running Tests

To execute the backend unit test suite with coverage:
```bash
cd backend
npm test
```
