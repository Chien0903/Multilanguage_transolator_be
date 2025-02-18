import { MdTranslate, MdHistory, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  return (
    <div className="w-20 bg-[#004098CC] text-white flex flex-col items-center py-6 space-y-6 relative">
      <div className="flex flex-col items-center space-y-4 mt-6">
        <MdTranslate size={32} className="cursor-pointer" onClick={() => navigate('/')} />
        <span className="text-xs">Translate</span>
        <hr className="w-10 border-white" />
        <MdHistory size={32} className="cursor-pointer" onClick={() => navigate('/history')} />
        <span className="text-xs">File history</span>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center text-center">
        <MdSettings size={32} className="cursor-pointer" onClick={() => navigate('/settings')} />
        <span className="text-xs leading-tight">Update Vocabulary</span>
      </div>
    </div>
  );
};

export default SideBar;