// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes'); // Assuming your routes are in ./routes/bookRoutes.js

const app = express();
app.use(express.json());

// Define a function to connect to the database
// This function will be called by your server.js or by your test file
const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // You can add more options here if needed
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure in a real app
  }
};

// Routes
app.use('/api', bookRoutes);

// Export app and connectDB function
module.exports = { app, connectDB };

// ✅ Only start the server AND connect to DB if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const DEFAULT_MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookdb';

  connectDB(DEFAULT_MONGO_URI)
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}