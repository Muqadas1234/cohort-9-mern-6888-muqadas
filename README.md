# Notes App

A full-stack web application built using Node.js, Express, MongoDB Atlas, and React with Vite that allows registered users to create, search, edit, and delete personal notes securely.

## Tech Stack

Frontend: React 19, Vite, Vanilla CSS, AuthContext
Backend: Node.js, Express.js, MongoDB Atlas, Socket.IO
Authentication: JWT, bcrypt
Logging: Pino Logger
Testing: Mocha and Chai for backend unit tests

## Additional Features

- Real-Time Updates: Live notes creation, update, and deletion sync across multiple tabs using Socket.IO.
- Export and Import: Backup notes to a JSON file and restore notes directly from JSON file.
- Search and Filter: Real-time title and content filtering in the top navbar.

## Project Layout

The repository is divided into two main folders:

- backend: Contains Express server configuration, Mongoose schemas, controllers, authentication middleware, Pino logging, and Mocha unit tests.
- frontend: Contains React 19 single-page application, login and signup forms, Notes dashboard, search filtering, modals, and API service integration.

## Getting Started

### Prerequisites

Make sure Node.js (version 18 or higher) and npm are installed on your machine.

### Running Backend Server

Navigate to the backend directory, install dependencies, and start the server:

cd backend
npm install
npm start

The backend API server will run on http://localhost:5000.

### Running Frontend Application

In a separate terminal window, navigate to the frontend directory, install dependencies, and start the development server:

cd frontend
npm install
npm run dev

The application will be accessible in your browser at http://localhost:5173.

## Unit Testing

To run the backend unit tests and generate the coverage report:

cd backend
npm test

This executes 15 Mocha unit tests covering authentication and note services.
