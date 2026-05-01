import mongoose from 'mongoose';

/**
 * Student Schema
 * 
 * WHY: Defines the structure and validation rules for our primary domain entity.
 * We embed 'grades' and 'attendance' directly in the document because they are 
 * strongly bound to the student and frequently accessed together (One-to-Few relationship).
 */
const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    major: {
      type: String,
      required: [true, 'Major/Filière is required'],
      index: true, // We will filter by major frequently, so indexing it improves query performance
    },
    // We embed a simple grades array. Each grade maps to a course code and a score.
    grades: [
      {
        courseCode: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
      }
    ],
    // Attendance percentage (0-100)
    attendanceRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    // This field will be updated by our FastAPI predictive microservice
    riskScore: {
      type: Number,
      default: null, // Null indicates it hasn't been calculated yet
      min: 0,
      max: 100,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Core requirement: Soft Deletes
      select: false, // Exclude this field from query results by default
    }
  },
  {
    timestamps: true,
  }
);

// --- PRE-FIND HOOK FOR SOFT DELETE ---
// WHY: We intercept all 'find' queries to automatically exclude soft-deleted records.
// This is a powerful pattern because the controller doesn't even need to know soft deletes exist.
studentSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
