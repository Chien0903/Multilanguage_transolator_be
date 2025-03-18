import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const updateName = () => {
      setFirstName(localStorage.getItem("firstName") || "");
      setLastName(localStorage.getItem("lastName") || "");
    };

    updateName(); // Cập nhật ngay khi component render

    window.addEventListener("storage", updateName);
    return () => {
      window.removeEventListener("storage", updateName);
    };
  }, []);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#C4D3E7] flex items-center justify-between p-4 shadow-md w-full">
      <img
        src="https://www.toray.com/global/shared/images/toray_logo.svg"
        alt="Toray Logo"
        className="h-10"
      />

      {/* Container avatar + menu */}
      <div
        className="relative inline-flex items-center whitespace-nowrap" 
        onMouseEnter={() => setShowUserMenu(true)}
        onMouseLeave={() => setShowUserMenu(false)}
      >
        <span className="mr-2 font-semibold">{firstName} {lastName}</span>
        <IoPersonCircleOutline size={40} className="cursor-pointer" />

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 top-full bg-white border rounded-md shadow-md w-44 z-10">
            <ul className="flex flex-col">
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2"
                onClick={() => navigate("/myprofile")}
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
