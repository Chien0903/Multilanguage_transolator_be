import React, { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

const Header = ({ fullName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("access"); // Xóa JWT token
        localStorage.removeItem("refresh");
        localStorage.removeItem("full_name");
        window.location.href = "/login"; // Chuyển về trang đăng nhập
      };
      
    return (
        <div className="bg-[#C4D3E7] flex items-center justify-between p-4 shadow-md w-full relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
            <img
            src="https://www.toray.com/global/shared/images/toray_logo.svg"
            alt="Toray Logo"
            className="h-10"
            />
        </div>

        {/* User Dropdown */}
        <div className="relative">
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            >
            <span className="text-sm">{fullName}</span>
            <IoPersonCircleOutline size={24} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10">
                <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                Account Info
                </a>
                <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                Logout
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

export default Header;
