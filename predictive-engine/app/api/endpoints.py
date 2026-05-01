from fastapi import APIRouter
from app.schemas.predict import StudentDataInput, RiskScoreOutput
from app.services.calculator import calculate_risk

# Create an APIRouter instance. This allows us to modularize our routes
# and include them in the main application cleanly.
router = APIRouter()

@router.post("/predict-risk", response_model=RiskScoreOutput)
async def predict_risk_endpoint(student_data: StudentDataInput):
    """
    Endpoint to predict the risk score for a student.
    
    FastAPI automatically:
    1. Reads the JSON body from the request.
    2. Validates the payload against the StudentDataInput Pydantic schema.
    3. Injects the parsed object into the `student_data` parameter.
    4. Automatically generates Swagger UI documentation based on these schemas.
    """
    # 1. Calculate the risk score using our business logic service
    risk_score = calculate_risk(student_data)
    
    # 2. Return the data adhering to the RiskScoreOutput schema.
    # FastAPI will automatically serialize this into JSON.
    return RiskScoreOutput(
        studentId=student_data.studentId,
        riskScore=risk_score
    )
