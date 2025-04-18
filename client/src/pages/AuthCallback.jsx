import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          console.error("No token found in callback URL");
          setError("Authentication failed. No token received.");
          setLoading(false);
          return;
        }

        console.log("Token received in callback:", token);
        
        // Store the token in localStorage
        localStorage.setItem("token", token);
        
        // Redirect to home page
        console.log("Redirecting to home page...");
        navigate("/");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-emerald-500 mb-4">Authentication Successful</h1>
        <p className="mb-4">Redirecting you to the dashboard...</p>
        <div className="w-12 h-12 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback; 