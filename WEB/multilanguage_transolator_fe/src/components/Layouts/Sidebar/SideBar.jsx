import { MdTranslate, MdHistory, MdLibraryBooks, MdManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SideBar = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // Lấy role từ localStorage
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
    <div className="w-20 bg-[#004098CC] text-white flex flex-col items-center py-6 space-y-6 relative">
      {/* Translate and History */}
      <div className="flex flex-col items-center space-y-4 mt-6">
        <MdTranslate size={32} className="cursor-pointer" onClick={() => navigate('/')} />
        <span className="text-xs">Translate</span>
        <hr className="w-10 border-white" />
        <MdHistory size={32} className="cursor-pointer" onClick={() => navigate('/history')} />
        <span className="text-xs">File history</span>
      </div>

      {/* Chỉ hiển thị khi role là Admin */}
      {role === "Admin" && (
        <>
          {/* Update Vocabulary */}
          <div
            className="absolute bottom-24 flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
            onClick={() => navigate('/common-library')}
          >
            <MdLibraryBooks size={32} />
            <span className="text-xs mt-1 leading-tight">Update Vocabulary</span>
          </div>

          {/* Account Management */}
          <div
            className="absolute bottom-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#003080] p-2 rounded w-full text-center"
            onClick={() => navigate('/admin')}
          >
            <MdManageAccounts size={32} />
            <span className="text-xs mt-1 leading-tight">Account Management</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
