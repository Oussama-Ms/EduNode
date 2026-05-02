from app.schemas.predict import StudentDataInput

def calculate_risk(student_data: StudentDataInput) -> float:
    """
    Mock mathematical calculation for the student risk score.
    In a real-world scenario, this would invoke a trained Machine Learning model.
    For now, we use a weighted algorithm based on attendance and average grade.
    
    Weights:
    - Attendance: 40% impact
    - Grades: 60% impact
    """
    # Base risk starts at 0
    risk_score = 0.0
    
    # 1. Attendance calculation (Inverse relationship: low attendance = high risk)
    # If attendance is 100%, risk from attendance is 0. If 0%, risk is 40.
    attendance_risk = (100 - student_data.attendanceRate) * 0.4
    risk_score += attendance_risk
    
    # 2. Grade calculation
    if not student_data.grades:
        # If there are no grades, we assume a baseline moderate risk of 30 due to lack of data
        grade_risk = 30.0
    else:
        # Calculate the average grade
        total_score = sum(grade.score for grade in student_data.grades)
        average_grade = total_score / len(student_data.grades)
        
        # Inverse relationship: low average grade = high risk.
        # If average grade is 100%, risk from grades is 0. If 0%, risk is 60.
        # Convert to 100 scale
        average_grade_Normalized= average_grade * 5
        grade_risk = (100 - average_grade_Normalized) * 0.6
        
    risk_score += grade_risk
    
    # Ensure the final risk score is bounded between 0 and 100
    risk_score = max(0.0, min(100.0, risk_score))
    
    return round(risk_score, 2)
