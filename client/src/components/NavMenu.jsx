import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavMenu = ({ showMenu, setshowMenu, token, handleLogout }) => {
  const [active, setactive] = useState("home");
  return (
    <div
      className={`fixed transition-all duration-300 shadow-lg top-0 right-0 z-50 bg-white w-[100vw]
      ${showMenu ? "translate-x-0" : "translate-x-full"}`}
    >
      <ul className="relative pt-12 pb-10">
        <img
          onClick={() => {
            setshowMenu(false);
          }}
          src="/ui-images/close.svg"
          className="absolute top-3 right-3 w-5 h-5"
          alt=""
        />
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${active === "home" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        >
          <Link
            onClick={() => {
              setactive("home");
            }}
            to="/"
          >
            home
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${
          active === "content library"
            ? "bg-black text-white"
            : "hover:bg-gray-200"
        }`}
        >
          <Link
            onClick={() => {
              setactive("content library");
            }}
            to="/content-library"
          >
            content library
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${
          active === "find your passion"
            ? "bg-black text-white"
            : "hover:bg-gray-200"
        }`}
        >
          <Link
            onClick={() => {
              setactive("find your passion");
            }}
            to="/find-your-passion"
          >
            find your passion
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${
          active === "action hub" ? "bg-black text-white" : "hover:bg-gray-200"
        }`}
        >
          <Link
            onClick={() => {
              setactive("action hub");
            }}
            to="/action-hub"
          >
            action hub
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${
          active === "interactive map"
            ? "bg-black text-white"
            : "hover:bg-gray-200"
        }`}
        >
          <Link
            onClick={() => {
              setactive("interactive map");
            }}
            to="/interactive-map"
          >
            interactive map
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${active === "chat" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        >
          <Link
            onClick={() => {
              setactive("chat");
            }}
            to="/community-chat"
          >
            community & chat
          </Link>
        </li>
        <li
          className={`text-lg font-medium pl-5 py-3  
        ${active === "profile" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        >
          <Link
            onClick={() => {
              setactive("profile");
            }}
            to="/profile"
          >
            profile
          </Link>
        </li>
      </ul>
      <div className="transition-all duration-300 flex flex-col w-full">
        {!token ? (
          <>
            <Link to="/auth">
              <button className="w-[90%] mx-[5%] transition-all hover:text-emerald-500 hover:bg-transparent duration-300 border border-transparent hover:border-emerald-500 rounded-md  bg-emerald-500 text-white font-medium my-4 py-1 px-3 mr-2">
                Login
              </button>
            </Link>
            <Link to="/auth">
              <button
                className={`w-[90%] mx-[5%] hover:text-black transition-all hover:bg-transparent duration-300 border border-transparent hover:border-emerald-500 rounded-md bg-black text-white font-medium my-4 py-1 px-3 mr-2`}
              >
                SignUp
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="w-[90%] mx-[5%] my-4 py-1 px-3 mr-3 transition-all hover:text-red-500 hover:bg-transparent duration-300 border border-transparent hover:border-red-500 rounded-md bg-black text-white  font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default NavMenu;
