import axios from "axios";

// Determine the base URL based on the environment
const BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://freshcart-backend-yoc7.onrender.com" 
    : "http://localhost:5000";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});