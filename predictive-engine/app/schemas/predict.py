from pydantic import BaseModel, Field
from typing import List

class Grade(BaseModel):
    """
    Schema for a single grade.
    Ensures that every grade received has a valid course code and a score.
    """
    courseCode: str = Field(..., description="The unique code of the course")
    score: float = Field(..., ge=0, le=20, description="The grade achieved, between 0 and 20")

class StudentDataInput(BaseModel):
    """
    Pydantic schema to strictly define the incoming JSON payload for the predict endpoint.
    If the API Gateway sends data that doesn't match this structure, FastAPI will automatically
    reject the request with a 422 Unprocessable Entity error.
    """
    studentId: str = Field(..., description="The ID of the student")
    attendanceRate: float = Field(..., ge=0, le=100, description="Attendance percentage, between 0 and 100")
    grades: List[Grade] = Field(default=[], description="List of the student's grades")

class RiskScoreOutput(BaseModel):
    """
    Schema for the response sent back to the API Gateway.
    Ensures the response is always properly formatted as JSON containing the riskScore.
    """
    studentId: str = Field(..., description="The ID of the student")
    riskScore: float = Field(..., ge=0, le=100, description="The calculated risk score percentage, between 0 and 100")
