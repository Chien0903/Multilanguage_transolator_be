import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine page title based on current route
  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes("/common-library")) {
      return "COMMON LIBRARY";
    } 
    if (path.includes("/admin")) {
      return "Account Management";
    }
    
    return null;
  };

  const pageTitle = getPageTitle();

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
    <div className="bg-[#C4D3E7] flex items-center p-4 shadow-md w-full relative">
      {/* Logo on left */}
      <div className="z-10">
        <img
          src="https://www.toray.com/global/shared/images/toray_logo.svg"
          alt="Toray Logo"
          className="h-10"
        />
      </div>
      
      {/* Centered title */}
      {pageTitle && (
        <div className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
          <h1 className="text-2xl font-bold text-[#004098CC]">
            {pageTitle}
          </h1>
        </div>
      )}

      {/* User menu on right */}
      <div
        className="relative inline-flex items-center whitespace-nowrap ml-auto z-10" 
        onMouseEnter={() => setShowUserMenu(true)}
        onMouseLeave={() => setShowUserMenu(false)}
      >
        <div className="flex flex-col items-end mr-2">
          <span className="font-semibold">{firstName} {lastName}</span>
          <span className="text-xs text-gray-600">{role}</span>
        </div>
        <IoPersonCircleOutline size={40} className="cursor-pointer" />

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 top-full bg-white border rounded-md shadow-md w-44 z-10">
            <ul className="flex flex-col">
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2"
                onClick={() => navigate("/my-profile")}
              >
                <FaUser className="text-gray-600" />
                <span>My Account</span>
              </li>
              <hr className="border-gray-300" />
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2"
                onClick={() => navigate("/change-password")}
              >
                <FaKey className="text-gray-600" />
                <span>Change Password</span>
              </li>
              <hr className="border-gray-300" />
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2"
                onClick={() => navigate("/logout")}
              >
                <FaSignOutAlt className="text-gray-600" />
                <span>Log out</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;