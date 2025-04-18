import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
});

// Request interceptor to attach token to every request
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // Add Authorization header if token exists
    if (token) {
      // Log token being used (with truncation for security)
      const tokenPreview = token.length > 10 ? 
        `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : 
        '(token too short)';
      console.log(`Adding token to request: ${tokenPreview}`);
      
      // Use consistent format for Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No token available for request");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request (401). Details:", error.response.data);
      
      // Check if we're already on the auth page to prevent redirect loops
      if (!window.location.pathname.includes("/auth")) {
        console.log("Redirecting to auth page due to 401 error");
        localStorage.removeItem("token"); // Clear invalid token
        window.location.href = "/auth";
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
