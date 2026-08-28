const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error({ error: error.message }, 'MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = connectDB;