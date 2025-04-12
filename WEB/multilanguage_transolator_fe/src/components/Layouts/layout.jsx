import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Layouts/Header/index";  
import Sidebar from "../Layouts/Sidebar/index";  
import api from "../../services/api";

const Layout = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access");

        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/user/profile/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        localStorage.setItem("firstName", response.data.first_name);
        localStorage.setItem("lastName", response.data.last_name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        setRole(response.data.role); 
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error(" Lỗi khi lấy thông tin user:", error);
        navigate("/login"); 
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <Header />

      <div className="flex flex-1 w-full overflow-hidden">        
        <Sidebar />
        <div className="flex flex-1 p-6 flex-col justify-center overflow-hidden">
          <Outlet />  
        </div>
      </div>
    </div>
  );
};

export default Layout;
