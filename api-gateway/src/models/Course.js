import mongoose from 'mongoose';

/**
 * Course Schema
 * 
 * WHY: Represents a standalone resource. Courses might be related to students, 
 * but they exist independently. We keep it separate to avoid massive nested documents 
 * in the Student collection, following standard NoSQL normalization practices for 
 * entities that have a many-to-many or independent lifecycle.
 */
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true, // Automatically removes whitespace from both ends
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true, // Ensures no two courses share the same identifier
      uppercase: true, // Normalizes the code to uppercase
    },
    credits: {
      type: Number,
      required: true,
      min: [1, 'Course must have at least 1 credit'],
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// --- PRE-FIND HOOK FOR SOFT DELETE ---
// WHY: Instead of adding { isDeleted: false } to every single query in our controllers,
// we intercept ALL 'find', 'findOne', and 'findOneAndUpdate' queries at the schema level.
// This guarantees we never accidentally expose deleted data.
courseSchema.pre(/^find/, function (next) {
  // 'this' refers to the current query object
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
