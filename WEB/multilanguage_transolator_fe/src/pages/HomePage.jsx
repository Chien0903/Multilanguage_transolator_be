import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdTranslate, MdHistory, MdSettings, MdSwapHoriz } from "react-icons/md";
import Header from "../components/Header/Header";
import SideBar from "../components/Home/SideBar";
import TranslationPanel from "../components/Home/TranslationPanel";

const HomePage = () => {
    const [fullName, setfullName] = useState("");
    useEffect(() => {
        const storedFullName = localStorage.getItem("full_name");
        if (storedFullName) {
            setfullName(storedFullName);
        }  
    }, []);
    return (
        <div className="flex h-screen w-full flex-col">
      <Header fullName={fullName}/>
      <div className="flex flex-1 w-full">
        <SideBar />
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-6">
          <TranslationPanel />
        </div>
      </div>
    </div>
    );
};

export default HomePage;