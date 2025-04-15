import { MdTranslate, MdHistory, MdLibraryBooks, MdManageAccounts, MdMenu, MdNoteAlt } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SideBar = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [expanded, setExpanded] = useState(false); // Start collapsed by default
  const navigate = useNavigate();
  const location = useLocation();

  // Cập nhật role khi `localStorage` thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={`${expanded ? 'w-60' : 'w-20'} bg-white border border-gray-200 shadow-sm flex flex-col py-6 relative h-screen`}
      style={{
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'width',
        overflowX: 'hidden'
      }}
    >
      {/* Hamburger Menu Button */}
      <div 
        className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 mb-6 w-full"
        onClick={toggleSidebar}
      >
        <div className="text-[#3186B1] bg-[#E2F0F6] rounded-full p-2">
          <MdMenu size={24} />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col w-full space-y-1 h-full">
        {/* Translate */}
        <div 
          className={`flex items-center cursor-pointer p-3 ${isActive('/') ? 'bg-[#E2F0F6] text-[#3186B1]' : 'hover:bg-gray-100'} mx-3 rounded-md whitespace-nowrap`}
          onClick={() => navigate('/')}
        >
          <MdTranslate size={24} className={`${isActive('/') ? 'text-[#3186B1]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-3 font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>Translate</span>
        </div>

        {/* File history */}
        <div 
          className={`flex items-center cursor-pointer p-3 ${isActive('/file-history') ? 'bg-[#E2F0F6] text-[#3186B1]' : 'hover:bg-gray-100'} mx-3 rounded-md whitespace-nowrap`}
          onClick={() => navigate('/file-history')}
        >
          <MdHistory size={24} className={`${isActive('/file-history') ? 'text-[#3186B1]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-3 font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>File history</span>
        </div>

        {/* Private Library */}
        <div 
          className={`flex items-center cursor-pointer p-3 ${isActive('/user-library') ? 'bg-[#E2F0F6] text-[#3186B1]' : 'hover:bg-gray-100'} mx-3 rounded-md whitespace-nowrap`}
          onClick={() => navigate('/user-library')}
        >
          <MdNoteAlt size={24} className={`${isActive('/user-library') ? 'text-[#3186B1]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-3 font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>Note</span>
        </div>
        
        {/* Admin-only sections - positioned at bottom of the list */}
        {role === "Admin" && (
          <>
            <div className="flex-grow"></div>
            
            {/* Common Library */}
            <div
              className={`flex items-center cursor-pointer p-3 ${isActive('/common-library') ? 'bg-[#E2F0F6] text-[#3186B1]' : 'hover:bg-gray-100'} mx-3 rounded-md whitespace-nowrap`}
              onClick={() => navigate('/common-library')}
            >
              <MdLibraryBooks size={24} className={`${isActive('/common-library') ? 'text-[#3186B1]' : 'text-gray-500'} flex-shrink-0`} />
              <span className={`ml-3 font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>Library</span>
            </div>

            {/* Account Management */}
            <div
              className={`flex items-center cursor-pointer p-3 ${isActive('/admin') ? 'bg-[#E2F0F6] text-[#3186B1]' : 'hover:bg-gray-100'} mx-3 rounded-md whitespace-nowrap`}
              onClick={() => navigate('/admin')}
            >
              <MdManageAccounts size={24} className={`${isActive('/admin') ? 'text-[#3186B1]' : 'text-gray-500'} flex-shrink-0`} />
              <span className={`ml-3 font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>Account Management</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;