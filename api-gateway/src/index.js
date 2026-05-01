import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Import our custom modules
import connectDB from './config/db.js';
import timeTracker from './middlewares/timeTracker.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables (useful if running locally outside docker without docker-compose env injection)
dotenv.config();

// Connect to MongoDB
// WHY: We initiate the database connection before starting the server.
connectDB();

const app = express();

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

// Helmet sets various HTTP headers for security (e.g., hiding X-Powered-By)
app.use(helmet());

// CORS allows our React frontend to make requests to this API without browser blockages
app.use(cors());

// Built-in middleware to parse incoming JSON payloads in the request body
app.use(express.json());

// Our custom Time Tracker middleware. 
// WHY: Placed here, it intercepts EVERY request hitting our API.
app.use(timeTracker);


// ==========================================
// ROUTES
// ==========================================

// Mount the routers under prefixes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// A simple health check route for the orchestrator
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Gateway is running' });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway Server running on port ${PORT}`);
});
