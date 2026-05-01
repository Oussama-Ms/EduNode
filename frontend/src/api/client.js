import axios from 'axios';

// Create an Axios instance with a base URL pointing to the API Gateway.
// In a Docker/Vite setup, accessing localhost:5000 from the host browser works perfectly.
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
