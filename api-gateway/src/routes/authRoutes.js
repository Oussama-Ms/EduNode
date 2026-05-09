import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', authLimiter, loginAdmin);

export default router;
