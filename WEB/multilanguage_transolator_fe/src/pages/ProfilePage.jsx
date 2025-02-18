import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import SideBar from "../components/Home/SideBar";
import ProfileForm from "../components/ProfileForm";

const MyProfile = () => {
    const [fullName, setfullName] = useState("");
    useEffect(() => {
        const storedFullName = localStorage.getItem("full_name");
        if (storedFullName) {
            setfullName(storedFullName);
        }  
    }, []);
    console.log(fullName);
  return (
    <div className="flex h-screen w-full flex-col">
      <Header fullName={fullName}/>
      <div className="flex flex-1 w-full">
        <SideBar />
        <ProfileForm />
      </div>
    </div>
  );
};

export default MyProfile;