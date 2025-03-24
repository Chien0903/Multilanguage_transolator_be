import { MdTranslate, MdHistory, MdLibraryBooks, MdManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SideBar = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

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

  return (
    <div className="w-20 bg-[#004098CC] text-white flex flex-col items-center py-6 space-y-4 relative">
      {/* Translate and History */}
        <div 
          className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
          onClick={() => navigate('/')}
        >
          <MdTranslate size={32} />
          <span className="text-xs mt-1">Translate</span>
        </div>
        <hr className="w-10 border-white" />

        <div 
        className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
        onClick={() => navigate('/file-history')}
        >
          <MdHistory size={32} />
          <span className="text-xs mt-1">File history</span>
        </div>
        <hr className="w-10 border-white" />

        <div 
        className="flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
        onClick={() => navigate('/user-library')}
        >
          <MdLibraryBooks size={32} />
          <span className="text-xs mt-1">Private Library</span>
        </div>

      {/* Chỉ hiển thị khi role là Admin */}
      {role === "Admin" && (
        <div className="mt-auto flex flex-col items-center w-full">
          {/* Divider between user and admin sections */}
          
          {/* Update Vocabulary */}
          <div
            className="absolute bottom-32 flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
            onClick={() => navigate('/common-library')}
          >
            <MdLibraryBooks size={32} />
            <span className="text-xs mt-1 leading-tight">Common Library</span>
          </div>

          {/* Account Management */}
          <div
            className="absolute bottom-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
            onClick={() => navigate('/admin')}
          >
            <MdManageAccounts size={32} />
            <span className="text-xs mt-1 leading-tight">Account Management</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;