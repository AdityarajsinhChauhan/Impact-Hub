import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleManualLogin = async () => {
    try {
      const data = await manualLogin(loginForm);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      alert("Manual login failed");
    }
  };
  

  const handleGoogleSuccess = async (credResponse) => {
    try {
      const data = await googleLogin(credResponse.credential);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Google sign-in failed");
    }
  };
  

  const handleSignup = async () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
  
    try {
      const data = await signup(signupForm);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
              className="w-full bg-emerald-500 text-white rounded-full py-2 transition-all duration-300 hover:bg-black font-medium"
              onClick={handleManualLogin}
            >
              Login
            </button>
            <span className="text-gray-500 text-xs flex items-center justify-center">
              OR CONTINUE WITH
            </span>

            <div className="w-full">
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

            <div className="w-full">
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
