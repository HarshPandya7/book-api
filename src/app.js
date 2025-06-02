const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bookdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api', bookRoutes);

// ✅ Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // ✅ Export app for tests
