const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Notes App backend is running!');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});