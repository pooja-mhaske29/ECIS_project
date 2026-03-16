
const path = require('path');
const dotenv = require('dotenv');

// Load .env with absolute path
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.error('❌ Failed to load .env file:', result.error);
  console.error('📁 Please create a .env file in:', __dirname);
  process.exit(1);
}

console.log('✅ .env file loaded successfully');
console.log('📁 .env location:', path.join(__dirname, '.env'));

// Verify MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  console.error('📝 Add this to your .env file:');
  console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Please check your MONGODB_URI in .env file');
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/violations', require('./routes/violationRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
});