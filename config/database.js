// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/telefunken';
    
    const options = {
      // Add these options for better stability
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Log the URI being used (remove in production)
    console.log('Attempting to connect to MongoDB at:', mongoUri);

    await mongoose.connect(mongoUri, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit the process immediately, allow for retry logic
    throw error;
  }
};

// Add retry logic
const connectWithRetry = async (maxRetries = 5, delay = 5000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await connectDB();
      return; // Success - exit the function
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('Failed to connect to MongoDB after', maxRetries, 'attempts');
        process.exit(1);
      }
      console.log(`Retrying connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectWithRetry;