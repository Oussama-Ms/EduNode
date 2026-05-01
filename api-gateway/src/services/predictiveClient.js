import axios from 'axios';

/**
 * Predictive Engine HTTP Client
 * 
 * WHY: We need to communicate with the Python FastAPI microservice to get the risk score.
 * By isolating this logic in a dedicated service file, the rest of the application 
 * (like the studentService) doesn't need to know *how* we get the score (e.g., HTTP vs gRPC),
 * it just calls this function.
 */
export const fetchRiskScore = async (studentData) => {
  try {
    // We use the environment variable injected by docker-compose,
    // which resolves to http://predictive-engine:8000
    const baseURL = process.env.PREDICTIVE_ENGINE_URL || 'http://localhost:8000';

    // We make a POST request to the FastAPI endpoint.
    // We send the student's grades, attendance, and ID (or 'new_student' if not yet saved to DB).
    const response = await axios.post(`${baseURL}/api/v1/predict-risk`, {
      studentId: studentData._id ? studentData._id.toString() : 'new_student',
      grades: studentData.grades,
      attendanceRate: studentData.attendanceRate
    });

    // We expect the Python service to return a JSON with a 'riskScore' property.
    return response.data.riskScore;
  } catch (error) {
    console.error(`Failed to fetch risk score from predictive engine:`, error.message);
    // If the predictive engine is down, we don't want to crash the student creation process.
    // Instead, we return null, meaning the score is "pending" or "unavailable".
    return null;
  }
};
