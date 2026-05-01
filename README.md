# EduNode - Modern School Management System

EduNode is an enterprise-grade, microservice-based School Management and Predictive Analytics System. It manages the lifecycle of students and courses, enhanced with a Python-powered predictive analytics engine to identify students at risk of failing.

## 🏗 Architecture & Technology Stack

This project is structured as a Dockerized monorepo containing three primary services:

1. **API Gateway (`api-gateway/`)**
   - **Tech:** Node.js, Express.js, Mongoose.
   - **Role:** The primary entry point. Handles REST API routing, business logic, MongoDB interactions, JWT authentication, and rate limiting.

2. **Predictive Engine (`predictive-engine/`)**
   - **Tech:** Python, FastAPI, Pydantic.
   - **Role:** An isolated microservice that receives student data from the API Gateway and calculates a mathematical "Risk Score".

3. **Frontend Dashboard (`frontend/`)**
   - **Tech:** React.js, Vite, Tailwind CSS.
   - **Role:** The user interface for interacting with the EduNode APIs (To be built in Phase 4).

4. **Database**
   - **Tech:** MongoDB.
   - **Role:** Persistent storage for Students and Courses.

## 🚀 Getting Started

The entire application is containerized for seamless local development. You do not need to install Node or Python on your local machine; you only need Docker.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Running the Application

1. Open a terminal in the root directory of this project (`EduNode/`).
2. Run the following Docker Compose command to build the images and start the containers in the background:

```bash
docker-compose up -d --build
```

3. **Verify the services are running:**
   - **MongoDB:** Running internally on port `27017`.
   - **API Gateway:** Available at `http://localhost:5000`
   - **Predictive Engine:** Available at `http://localhost:8000` (Swagger Docs: `http://localhost:8000/api/v1/openapi.json`)
   - **Frontend:** Available at `http://localhost:5173`

### Stopping the Application

To gracefully stop the containers:

```bash
docker-compose down
```

## 🧪 Testing the Integration

The API Gateway is already configured to automatically communicate with the Predictive Engine when creating a student.

To test this, make a `POST` request to `http://localhost:5000/api/students` (using Postman or cURL) with the following JSON payload:

```json
{
  "firstName": "OUSSAMA",
  "lastName": "M'SAAD",
  "email": "oussama.msaad@uit.ac.ma",
  "major": "Computer Science",
  "attendanceRate": 75,
  "grades": [
    { "courseCode": "CS101", "score": 85 },
    { "courseCode": "CS102", "score": 90 }
  ]
}
```

If the integration is successful, the response will include a `riskScore` calculated dynamically by the Python microservice!

## 🛡 Clean Architecture Highlights

- **Soft Deletes:** Documents are never permanently removed from the database; an `isDeleted` flag is used.
- **Strict Validation:** Incoming requests are validated using Zod (Node.js) and Pydantic (Python) before reaching the controllers.
- **Separation of Concerns:** Controllers are kept thin; all database logic and external API calls reside in the `services/` layer.
