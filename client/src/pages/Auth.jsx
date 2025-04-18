import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import {
  manualLogin,
  googleLogin,
  signup,
} from "../api/auth";


const Auth = () => {
  const [showLogin, setshowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordLogin, setShowPasswordLogin] = useState(false); // 👁️ Login password
  const [showPasswordSignup, setShowPasswordSignup] = useState(false); // 👁️ Signup password
  const [showConfirmPasswordSignup, setShowConfirmPasswordSignup] = useState(false); // 👁️ Confirm password
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error parameters in the URL
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      if (error === "auth_failed") {
        setErrorMessage("Authentication failed. Please try again.");
      } else if (error === "google_auth_failed") {
        setErrorMessage("Google authentication failed. Please try again.");
      } else if (error === "server_error") {
        setErrorMessage("Server error. Please try again later.");
      }
    }
  }, [location]);

  const handleManualLogin = async () => {
    try {
      const data = await manualLogin(loginForm);
      
      // Set token in localStorage
      localStorage.setItem("token", data.token);
      
      // Mark this as a fresh login
      sessionStorage.setItem("freshLogin", "true");
      
      // Add a delay before navigating to ensure token is properly saved
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };
  

  const handleGoogleSuccess = async (credResponse) => {
    try {
      const data = await googleLogin(credResponse.credential);
      
      // Set token in localStorage
      localStorage.setItem("token", data.token);
      
      // Mark this as a fresh login
      sessionStorage.setItem("freshLogin", "true");
      
      // Add a delay before navigating
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      console.log(err);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/start`;
  };
  

  const handleSignup = async () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
  
    try {
      const data = await signup(signupForm);
      
      // Set token in localStorage
      localStorage.setItem("token", data.token);
      
      // Mark this as a fresh login
      sessionStorage.setItem("freshLogin", "true");
      
      // Add a delay before navigating
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
    }
  };
  

  return (
    <div className="w-[100vw] h-full flex justify-center items-center bg-emerald-50">
      <div className="container bg-white w-[30rem] shadow-xl my-5 flex flex-col">
        <h1 className="text-2xl flex items-center justify-center font-medium mt-10">
          Impact Hub
        </h1>
        <span className="flex items-center justify-center text-gray-500">
          Connect, Learn, and Lead the Change
        </span>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-6">
            <span className="block sm:inline">{errorMessage}</span>
            <span 
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setErrorMessage("")}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}

        <div className="relative flex w-full mt-5 bg-gray-100 p-1 rounded-md overflow-hidden">
          <div
            className={`absolute h-full w-1/2 bg-white transition-all duration-300 rounded-md ${
              showLogin ? "left-0" : "left-1/2"
            }`}
          />
          <button
            className={`w-1/2 py-1 z-10  ${
              showLogin ? "text-emerald-600" : "text-gray-500"
            }`}
            onClick={() => setshowLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-1 z-10 ${
              !showLogin ? "text-emerald-600" : "text-gray-500"
            }`}
            onClick={() => setshowLogin(false)}
          >
            Signup
          </button>
        </div>

        {showLogin ? (
          <div className="flex flex-col gap-4 items-center justify-center mt-6 px-6">
            <div className="flex flex-col w-full mb-5">
              <label className="font-medium mb-2 ml-5" htmlFor="email">
                Email
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full"
                type="email"
                placeholder="your@email.com"
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col w-full mb-5 relative">
              <label className="font-medium ml-5 mb-3" htmlFor="password">
                Password
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full"
                type={showPasswordLogin ? "text" : "password"}
                placeholder="Password"
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <div
                className="absolute right-2 top-12 cursor-pointer"
                onClick={() => setShowPasswordLogin((prev) => !prev)}
              >
                {showPasswordLogin ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <button
              className="w-full bg-emerald-500 text-white rounded-lg py-2 transition-all duration-300 hover:bg-black font-medium"
              onClick={handleManualLogin}
            >
              Login
            </button>
            <span className="text-gray-500 text-xs flex items-center justify-center">
              OR CONTINUE WITH
            </span>

            <div className="w-full flex rounded-lg flex-col gap-3">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => {}} />
              
             
            </div>
            <p className="text-sm mb-6">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setshowLogin(false);
                }}
                className="text-emerald-500 underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center mt-6 px-6">
            <div className="flex flex-col w-full mb-1">
              <label className="font-medium mb-3 ml-5" htmlFor="name">
                Name
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full"
                type="text"
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col w-full mb-5">
              <label className="font-medium mb-3 ml-5" htmlFor="email">
                Email
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full"
                type="email"
                placeholder="your@email.com"
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col w-full mb-1 relative">
              <label className="font-medium mb-3 ml-5" htmlFor="password">
                Password
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full pr-10"
                type={showPasswordSignup ? "text" : "password"}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
              />
              <div
                className="absolute right-2 top-12 cursor-pointer"
                onClick={() => setShowPasswordSignup((prev) => !prev)}
              >
                {showPasswordSignup ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="flex flex-col w-full mb-1 relative">
              <label className="font-medium mb-3 ml-5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="py-2 px-3 border border-gray-200 rounded-full pr-10"
                type={showConfirmPasswordSignup ? "text" : "password"}
                onChange={(e) =>
                  setSignupForm({
                    ...signupForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div
                className="absolute right-2 top-12 cursor-pointer"
                onClick={() =>
                  setShowConfirmPasswordSignup((prev) => !prev)
                }
              >
                {showConfirmPasswordSignup ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </div>
            </div>

            <button
              className="font-medium w-full bg-emerald-500 text-white rounded-sm py-2 transition-all duration-300 hover:bg-black"
              onClick={handleSignup}
            >
              Sign Up
            </button>
            <span className="text-gray-500 text-xs flex items-center justify-center">
              OR CONTINUE WITH
            </span>

            <div className="w-full flex rounded-lg flex-col gap-3">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => {}} />
              
              
            </div>

            <p className="text-sm mb-6">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setshowLogin(true);
                }}
                className="text-emerald-500 underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
