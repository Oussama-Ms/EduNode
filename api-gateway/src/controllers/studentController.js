import * as studentService from '../services/studentService.js';

/**
 * Student Controllers
 * 
 * WHY: Controllers are strictly responsible for extracting data from the HTTP Request (req),
 * passing it to the Service layer, and formatting the HTTP Response (res).
 * They should NOT contain complex logic or direct database queries.
 */

export const createStudent = async (req, res) => {
  try {
    // req.body is already validated by our Zod middleware!
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    // Extract query params for filtering. e.g., ?major=Computer Science
    const filter = {};
    if (req.query.major) filter.major = req.query.major;

    const students = await studentService.getStudents(filter);
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await studentService.softDeleteStudent(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    // We return 200 instead of 204 because we want to send the soft-deleted object back as confirmation
    res.status(200).json({ success: true, message: 'Student successfully soft deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const { major } = req.query;
    if (!major) {
      return res.status(400).json({ success: false, message: 'Please provide a major in the query params' });
    }
    const stats = await studentService.calculateClassAverage(major);
    res.status(200).json({ success: true, data: stats || { message: 'No data for this major' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportStudents = async (req, res) => {
  try {
    const csvString = await studentService.generateCsvExport();
    
    if (!csvString) {
      return res.status(404).json({ success: false, message: 'No students found to export' });
    }

    // WHY: To trigger a file download in the browser instead of rendering the text,
    // we MUST override these specific HTTP headers.
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students_export.csv');
    
    // Send the raw string
    res.status(200).send(csvString);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
