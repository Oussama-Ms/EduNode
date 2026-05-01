import Student from '../models/Student.js';
import { fetchRiskScore } from './predictiveClient.js';
import { parse } from 'json2csv';

/**
 * Student Service
 * 
 * WHY: This file contains all the core Business Logic for Students.
 * Controllers should be "thin" (only handling HTTP req/res).
 * Services are "fat" (handling database calls, external API calls, algorithms).
 * This makes the business logic easily testable without needing mock HTTP requests.
 */

export const createStudent = async (studentData) => {
  // 1. Before saving to DB, call the Python Microservice to get the risk score
  const riskScore = await fetchRiskScore(studentData);
  
  // 2. Attach the score to the data payload
  const newStudentData = { ...studentData, riskScore };

  // 3. Save to MongoDB
  const student = new Student(newStudentData);
  return await student.save();
};

export const getStudents = async (queryFilters) => {
  // queryFilters could contain { major: 'Computer Science' }
  // Our schema hook automatically applies { isDeleted: { $ne: true } }
  return await Student.find(queryFilters);
};

export const getStudentById = async (id) => {
  return await Student.findById(id);
};

export const updateStudent = async (id, updateData) => {
  // If grades or attendance are updated, we ideally should recalculate the risk score.
  if (updateData.grades || updateData.attendanceRate) {
    // We need the full object to recalculate
    const currentStudent = await Student.findById(id);
    if(currentStudent) {
        const mergedData = { ...currentStudent.toObject(), ...updateData };
        updateData.riskScore = await fetchRiskScore(mergedData);
    }
  }

  // findByIdAndUpdate bypasses the save hook, so it's efficient. 
  // new: true returns the modified document rather than the original.
  return await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const softDeleteStudent = async (id) => {
  // Soft delete: We just set isDeleted to true instead of removing the document.
  return await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const calculateClassAverage = async (major) => {
  // WHY: We use MongoDB Aggregation Pipeline for heavy lifting.
  // It's much faster to let the database calculate averages than to fetch 
  // thousands of records into Node.js memory and calculate it in Javascript.
  const stats = await Student.aggregate([
    // Step 1: Filter by major (and ensure not deleted)
    { $match: { major: major, isDeleted: { $ne: true } } },
    // Step 2: Unwind the grades array (creates a document for each grade)
    { $unwind: "$grades" },
    // Step 3: Group back together and calculate the average score
    { 
      $group: { 
        _id: "$major", 
        averageScore: { $avg: "$grades.score" },
        totalStudentsEvaluated: { $sum: 1 } // Note: this sums grades, not students, if unwound
      } 
    }
  ]);

  return stats.length > 0 ? stats[0] : null;
};

export const generateCsvExport = async () => {
  // Fetch all active students
  const students = await Student.find().lean(); // .lean() returns plain JS objects, faster
  
  if (students.length === 0) return null;

  // Flatten the data for CSV
  const csvData = students.map(student => ({
    ID: student._id.toString(),
    FirstName: student.firstName,
    LastName: student.lastName,
    Email: student.email,
    Major: student.major,
    Attendance: `${student.attendanceRate}%`,
    RiskScore: student.riskScore !== null ? `${student.riskScore}%` : 'N/A'
  }));

  // Convert JSON to CSV format
  const csvString = parse(csvData);
  return csvString;
};
