import mongoose from 'mongoose';
import logger from './logger.js';

/**
 * Establish a connection to the MongoDB database.
 * 
 * WHY: Separating the database connection logic from the main application file (index.js)
 * follows the Single Responsibility Principle. It makes the code modular, easier to test,
 * and allows us to reuse the connection logic if needed elsewhere.
 */
const connectDB = async () => {
  try {
    // The MONGODB_URI is injected via Docker Compose or a .env file.
    // It defaults to a local fallback if not provided, though in production
    // an undefined URI should ideally throw an error to prevent connecting to wrong DBs.
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edunode_local';
    
    // Attempt connection. Mongoose >= 6.x no longer requires deprecated options 
    // like useNewUrlParser or useUnifiedTopology.
    const conn = await mongoose.connect(uri);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if the database cannot be reached.
    // A microservice is useless without its primary data store, so we let the 
    // orchestrator (Docker) handle restarting it.
    process.exit(1);
  }
};

export default connectDB;
