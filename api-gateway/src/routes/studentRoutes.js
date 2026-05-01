import express from 'express';
import { z } from 'zod';
import * as studentController from '../controllers/studentController.js';
import validateRequest from '../middlewares/validateRequest.js';
import protectAdminRoute from '../middlewares/authMiddleware.js';
import { postLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * Zod Validation Schema for Student Creation
 * WHY: We define exactly what a valid student looks like. 
 * If a request comes in missing a field, or with a string instead of a number,
 * Zod will catch it before it ever hits our database.
 */
const createStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  major: z.string().min(2, 'Major is required'),
  grades: z.array(z.object({
    courseCode: z.string(),
    score: z.number().min(0).max(100)
  })).optional(),
  attendanceRate: z.number().min(0).max(100).optional()
});

// ==========================================
// SPECIALIZED ROUTES
// These must come BEFORE /:id routes, otherwise Express thinks "export" is an ID!
// ==========================================

// GET /api/students/export - Triggers CSV Download
router.get('/export', studentController.exportStudents);

// GET /api/students/stats/average?major=CS - Calculates average
router.get('/stats/average', studentController.getStudentStats);


// ==========================================
// STANDARD CRUD ROUTES
// ==========================================

router.route('/')
  // Read all (supports ?major= filter)
  .get(studentController.getStudents)
  
  // Create Student
  // Applies POST rate limiter, then Zod validation, then calls controller
  .post(
    postLimiter, 
    validateRequest(createStudentSchema), 
    studentController.createStudent
  );

router.route('/:id')
  // Read specific student
  .get(studentController.getStudentById)
  
  // Update student
  .put(studentController.updateStudent)
  
  // Delete student (Soft Delete)
  // Protected route: requires JWT in Authorization header
  .delete(protectAdminRoute, studentController.deleteStudent);

export default router;
