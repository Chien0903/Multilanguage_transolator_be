import { MdTranslate, MdHistory, MdLibraryBooks, MdManageAccounts, MdMenu, MdNoteAlt, MdRuleFolder, MdFeedback } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SideBar = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [expanded, setExpanded] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update role when localStorage changes
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
      className={`${expanded ? 'w-[15rem]' : 'w-[5rem]'} bg-white border border-gray-200 shadow-sm flex flex-col py-[1.5rem] relative h-screen`}
      style={{
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'width',
        overflowX: 'hidden'
      }}
    >
      {/* Toggle Button */}
      <div 
        className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-[0.5rem] mb-[1.5rem] w-full"
        onClick={toggleSidebar}
      >
        <div className="text-[#2F80ED] bg-[#E6F0FD] rounded-full p-[0.5rem]">
          <MdMenu size={24} />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col w-full space-y-[0.25rem] h-full">
        {/* Translate */}
        <div 
          className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
          onClick={() => navigate('/')}
        >
          <MdTranslate size={24} className={`${isActive('/') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
            Translate
          </span>
        </div>

        {/* File history */}
        <div 
          className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/file-history') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
          onClick={() => navigate('/file-history')}
        >
          <MdHistory size={24} className={`${isActive('/file-history') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
            File history
          </span>
        </div>

        {/* Suggestion Review - visible to both Admin and Library Keeper */}
        {(role === "Admin" || role === "Library Keeper") && (
          <div
            className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/suggestion-review') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
            onClick={() => navigate('/suggestion-review')}
          >
            <MdFeedback size={24} className={`${isActive('/suggestion-review') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
            <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
              Review Suggestions
            </span>
          </div>
        )}

        {/* Admin and Library sections */}
        <div className="flex-grow"></div>

        {/* Suggestion Approval - only visible to Admin */}
        {role === "Admin" && (
          <div
            className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/suggestion-approval') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
            onClick={() => navigate('/suggestion-approval')}
          >
            <MdRuleFolder size={24} className={`${isActive('/suggestion-approval') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
            <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
              Approve Suggestions
            </span>
          </div>
        )}

        {/* Library */}
        <div
          className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/common-library') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
          onClick={() => navigate('/common-library')}
        >
          <MdLibraryBooks size={24} className={`${isActive('/common-library') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
          <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
            Library
          </span>
        </div>

        {/* Account Management */}
        {role === "Admin" && (
          <div
            className={`flex items-center cursor-pointer p-[0.75rem] ${isActive('/admin') ? 'bg-[#E6F0FD] text-[#2F80ED]' : 'hover:bg-gray-100'} mx-[0.75rem] rounded-md whitespace-nowrap`}
            onClick={() => navigate('/admin')}
          >
            <MdManageAccounts size={24} className={`${isActive('/admin') ? 'text-[#2F80ED]' : 'text-gray-500'} flex-shrink-0`} />
            <span className={`ml-[0.75rem] font-medium transform ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[1.25rem] absolute'}`} style={{ transition: 'transform 250ms ease, opacity 200ms ease' }}>
              Account Management
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;