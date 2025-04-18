import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navLinks } from "../assets/NavLinks";
import NavMenu from "./NavMenu";
import { UserCircle } from "lucide-react";

const Navbar = ({ active, setactive }) => {
  const [showMenu, setshowMenu] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`w-[100vw]" bg-white h-[11vh] "
`}
    >
      <NavMenu showMenu={showMenu} setshowMenu={setshowMenu} token={token} handleLogout={handleLogout}/>
      {/* title */}
      <div className="flex justify-between">
        <div className="flex">
          
          <Link
            to="/"
            className="text-black text-lg md:text-2xl font-bold my-4 ml-3"
          >
            Impact Hub
          </Link>
        </div>
        {/* navbar links */}

        <ul className="md:flex hidden duration-300">
          {navLinks.map((link) => (
            <li
              key={link.key}
              className={`my-4 px-3 py-1 ml-1 cursor-pointer transition-all font-medium rounded-md border border-transparent 
            text-black
              ${
                active === link.key
                  ? "text-white bg-black"
                  : " hover:border-black"
              }`}
            >
              <Link
                onClick={() => {
                  setactive(link.key);
                }}
                to={link.to}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* auth buttons */}

        <div className="md:block hidden transition-all duration-300">
          {!token ? (
            <>
              <Link to="/auth">
                <button className="transition-all hover:text-emerald-500 hover:bg-transparent duration-300 border border-transparent hover:border-emerald-500 rounded-md  bg-emerald-500 text-white font-medium my-4 py-1 px-3 mr-2">
                  Login
                </button>
              </Link>
              <Link to="/auth">
                <button
                  className={`hover:text-black transition-all hover:bg-transparent duration-300 border border-transparent hover:border-emerald-500 rounded-md bg-black text-white font-medium my-4 py-1 px-3 mr-2`}
                >
                  SignUp
                </button>
              </Link>
            </>
          ) : (
            <div className="flex items-center">
              <Link to="/profile">
                <button
                  onClick={() => setactive("profile")}
                  className="flex items-center justify-center transition-all hover:text-emerald-500 hover:bg-transparent duration-300 border border-transparent hover:border-emerald-500 rounded-md bg-emerald-500 text-white font-medium my-4 py-1 px-3 mr-2"
                >
                  <UserCircle className="mr-2" size={18} />
                  Profile
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="transition-all hover:text-red-500 hover:bg-transparent duration-300 border border-transparent hover:border-red-500 rounded-md bg-black text-white font-medium my-4 py-1 px-3 mr-3"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <img
            onClick={() => {
              setshowMenu(true);
            }}
            className="md:hidden my-5 mx-3 flex w-5 h-5"
            src="/ui-images/hamburger.svg"
            alt=""
          />
      </div>
    </div>
  );
};

export default Navbar;
