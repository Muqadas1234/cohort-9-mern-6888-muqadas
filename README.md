# Notes App

A full-stack MERN web application built using Node.js, Express, MongoDB Atlas, and React with Vite that allows registered users to create, search, edit, format, export, and delete personal notes securely in real time.

## Key Features

- **User Authentication**: Secure signup and login with hashed passwords (`bcrypt`) and JWT session persistence (`localStorage`).
- **Rich Text WYSIWYG Editor**: Interactive live text formatting for note Title and Content with Bold, Italic, Underline, Strikethrough, Headings (H1/H2), and Alignments.
- **Custom Typography & Emojis**: 22 selectable Google Font families, 7 list styles (Bullets, Squares, Numbers, Upper/Lower Roman, Upper/Lower Alpha), and 120+ categorized emojis.
- **Real-Time Synchronization**: Socket.IO integration with private user room isolation (`socket.join(userId)`) for live multi-tab updates.
- **Data Management**: Full JSON Export and Import backup capabilities via the Navbar Tools menu.
- **Search & Filter**: In-memory 1ms instant search bar filtering.
- **Unit Testing & CI/CD**: 15 Mocha & Chai unit tests achieving 98.57% test coverage with SonarQube CI integration.

## Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS (Dark Glassmorphism), AuthContext, Socket.IO Client
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), Socket.IO Server
- **Authentication**: JWT Tokens, bcrypt
- **Logging**: Pino Logger
- **Testing**: Mocha, Chai, NYC (Istanbul) for unit test coverage

## Additional Features

- **Real-Time Updates**: Live notes creation, update, and deletion sync across multiple tabs using Socket.IO.
- **Export and Import**: Backup notes to a JSON file and restore notes directly from JSON file.
- **Search and Filter**: Real-time title and content filtering in the top navbar.

## Project Layout

The repository is divided into two main folders:

- **`backend/`**: Contains Express server, Socket.IO room handling, Mongoose schemas, controllers, authentication middleware, Pino logging, and Mocha unit tests.
- **`frontend/`**: Contains React 19 SPA, Auth forms, Dashboard, Rich Text WYSIWYG editor modal, search filtering, JSON import/export tools, and Socket.IO client.

## Getting Started

### Prerequisites

Make sure Node.js (version 18 or higher) and npm are installed on your machine.

### Running Backend Server

Navigate to the backend directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm start
```

The backend API server will run on `http://localhost:5000`.

### Running Frontend Application

In a separate terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible in your browser at `http://localhost:5173`.

## Unit Testing

To run the backend unit tests and generate the coverage report:

```bash
cd backend
npm test
```

This executes 15 Mocha unit tests covering authentication and note services with 98.57% code coverage.
