// Dependencies and environment configuration
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
require('dotenv').config();
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

// Validate critical environment secrets on startup
if (!process.env.JWT_SECRET) {
  logger.error('FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO real-time server with user room isolation
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query?.userId;
  if (userId) {
    socket.join(String(userId));
    logger.info({ socketId: socket.id, userId }, 'User joined private socket room');
  } else {
    logger.info({ socketId: socket.id }, 'Anonymous socket connection');
  }

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Client disconnected from real-time socket');
  });
});

// Express middleware setup
app.use(express.json());
app.use(pinoHttp({ logger }));

// Inject Socket.IO into Express request pipeline
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API route registrations
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.send('Notes App backend is running!');
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize database connection and listen on configured port
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();