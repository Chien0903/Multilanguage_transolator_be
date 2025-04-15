import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateName = () => {
      setFirstName(localStorage.getItem("firstName") || "");
      setLastName(localStorage.getItem("lastName") || "");
      setRole(localStorage.getItem("role") || "");
    };

    updateName(); // Cập nhật ngay khi component render

    window.addEventListener("storage", updateName);
    return () => {
      window.removeEventListener("storage", updateName);
    };
  }, []);

  return (
    <div className="bg-white flex items-center p-4 border border-gray-200 w-full relative">
      {/* Logo on left */}
      <div className="z-10">
        <img
          src="https://www.toray.com/global/shared/images/toray_logo.svg"
          alt="Toray Logo"
          className="h-10"
        />
      </div>
      
      {/* User menu on right */}
      <div className="flex items-center ml-auto z-10">
        {/* User Profile */}
        <div
          className="relative inline-flex items-center whitespace-nowrap z-10 cursor-pointer" 
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FaUser size={20} className="text-gray-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{firstName} {lastName}</span>
              <span className="text-xs text-gray-600">{role}</span>
            </div>
            <IoChevronDown className="ml-1 text-gray-500" />
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-md w-[170px] z-20 overflow-hidden">
              <ul className="flex flex-col py-1">
                <li
                  className="px-5 py-3 text-base font-normal text-gray-800 cursor-pointer text-left hover:bg-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/my-profile");
                    setShowUserMenu(false);
                  }}
                >
                  My account
                </li>
                <li
                  className="px-5 py-3 text-base font-normal text-gray-800 cursor-pointer text-left hover:bg-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/change-password");
                    setShowUserMenu(false);
                  }}
                >
                  Change password
                </li>
                <li
                  className="px-5 py-3 text-base font-normal text-gray-800 cursor-pointer text-left hover:bg-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/logout");
                    setShowUserMenu(false);
                  }}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Header;