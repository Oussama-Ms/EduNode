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
  // We use findById and save() instead of findByIdAndUpdate 
  // because findByIdAndUpdate triggers the findOne hook again AFTER updating
  // to fetch the updated document, which would then be filtered out by the isDeleted: { $ne: true } hook,
  // returning null and making the controller think it failed!
  const student = await Student.findById(id);
  if (!student) return null;
  
  student.isDeleted = true;
  await student.save();
  return student;
};

export const calculateClassAverage = async () => {
  // WHY: We use MongoDB Aggregation Pipeline for heavy lifting.
  // We want to calculate the final grade (average) for each student first,
  // then calculate the average of all those student averages.
  const stats = await Student.aggregate([
    // Step 1: Filter out deleted students
    { $match: { isDeleted: { $ne: true } } },
    
    // Step 2: Unwind the grades array (creates a document for each grade)
    { $unwind: { path: "$grades", preserveNullAndEmptyArrays: false } },
    
    // Step 3: Group by student to calculate each student's average score
    { 
      $group: { 
        _id: "$_id", 
        studentAvg: { $avg: "$grades.score" }
      } 
    },
    
    // Step 4: Group all students together to calculate the overall class average
    {
      $group: {
        _id: null,
        overallAverage: { $avg: "$studentAvg" }
      }
    }
  ]);

  return stats.length > 0 ? stats[0].overallAverage : null;
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
