import React from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Home/SideBar";
import ChangePassForm from "../components/Form/ChangePassForm";

const ChangePassword = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <ChangePassForm />
      </div>
    </div>
  );
};

export default ChangePassword;