import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Processing authentication...");
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

        console.log("Token received in callback:", token ? "Token received" : "No token");
        
        // Store the token in localStorage
        localStorage.setItem("token", token);
        
        // Mark this as a fresh login
        sessionStorage.setItem("freshLogin", "true");
        
        console.log("Token stored in localStorage");
        
        // Verify token is accessible from localStorage
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          console.error("Token not properly stored in localStorage");
          setError("Authentication failed. Token storage issue.");
          setLoading(false);
          return;
        }
        
        setStatus("Token stored, confirming authentication...");
        
        // Use window.location.href for a more reliable redirect in case of token issues
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
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
        <p className="mb-4">{status}</p>
        <div className="w-12 h-12 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback; 