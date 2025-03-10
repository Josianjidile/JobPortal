import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {useNavigate} from "react-router-dom"
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {setShowRecruiterLogin} = useContext(AppContext);

  return (
    <div className="shadow py-4 bg-white">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <img onClick={()=> navigate("/")}  src={assets.logo} alt="Company Logo" className="h-10 cursor-pointer" />

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/applications" className="text-gray-700 hover:text-blue-600">
                Applied Jobs
              </Link>
              <span className="text-gray-400">|</span>
              <p className="text-gray-800 font-medium">Hi, {user.firstName} {user.lastName}</p>
              <UserButton />
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={e=>setShowRecruiterLogin(true)} className="text-gray-600">Recruiter Login</button>
              <button
                className="bg-blue-700 text-white px-6 sm:px-9 py-2 rounded-full"
                onClick={() => openSignIn()}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile View: Show only "Applied Jobs" & Avatar if user is logged in */}
        <div className="sm:hidden flex items-center gap-4">
          {user && (
            <>
              <Link to="/applications" className="text-gray-700 hover:text-blue-600 text-sm">
                Applied Jobs
              </Link>
              <UserButton />
            </>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu (Only visible when menu is open) */}
      {menuOpen && !user && (
        <div className="sm:hidden bg-gray-100 p-4">
          <div className="flex flex-col items-center gap-4">
            <button  className="text-gray-600">Recruiter Login</button>
            <button
              className="bg-blue-700 text-white px-6 py-2 rounded-full"
              onClick={() => openSignIn()}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
