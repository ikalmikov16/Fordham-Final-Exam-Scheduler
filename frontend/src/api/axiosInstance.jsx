import axios from "axios";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your Django API base URL
  timeout: 10000, // Set a timeout for requests (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// You can also set up interceptors here if needed (optional)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Add any custom behavior before the request is sent
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
