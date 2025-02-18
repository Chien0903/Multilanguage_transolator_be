import React, { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ fullName }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
      
    return (
      <div className="bg-[#C4D3E7] flex items-center justify-between p-4 shadow-md w-full relative">
      <img
        src="https://www.toray.com/global/shared/images/toray_logo.svg"
        alt="Toray Logo"
        className="h-10"
      />
      <div className="relative flex items-center space-x-2">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold">{fullName}</span>
        </div>
        <button className="flex items-center" onClick={() => setShowUserMenu(!showUserMenu)}>
          <IoPersonCircleOutline size={40} />
        </button>
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-md w-44 z-10 overflow-hidden">
            <ul className="flex flex-col">
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2 transition"
                onClick={() => navigate('/userProfile')}
              >
                <FaUser className="text-gray-600" />
                <span>My Account</span>
              </li>
              <hr className="border-gray-300" />
              <li
                className="p-3 text-sm font-medium text-gray-700 hover:bg-blue-100 cursor-pointer flex items-center space-x-2 transition"
                onClick={() => navigate('/logout')}
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
