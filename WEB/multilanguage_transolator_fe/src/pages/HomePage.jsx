import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdTranslate, MdHistory, MdSettings, MdSwapHoriz } from "react-icons/md";
import Header from "../components/Header/Header";

const HomePage = () => {
    const [fullName, setfullName] = useState("");
    useEffect(() => {
        const storedFullName = localStorage.getItem("full_name");
        if (storedFullName) {
            setfullName(storedFullName);
        }  
    }, []);
    console.log(fullName);
    const [showLanguages, setShowLanguages] = useState(false);
    const [selectedOriginLanguage, setSelectedOriginLanguage] = useState("Origin Language");
    const [availableTargetLanguages, setAvailableTargetLanguages] = useState(["English", "Japanese", "Chinese", "Vietnamese"]);
    const [selectedTargetLanguages, setSelectedTargetLanguages] = useState([]);
    const [showTargetDropdown, setShowTargetDropdown] = useState(false);

    const handleOriginLanguageSelect = (language) => {
        setSelectedOriginLanguage(language);
        setShowLanguages(false);
        setAvailableTargetLanguages(["English", "Japanese", "Chinese", "Vietnamese"].filter(lang => lang !== language));
        setSelectedTargetLanguages([]);
    };

    const handleTargetLanguageSelect = (language) => {
        setSelectedTargetLanguages(prev =>
        prev.includes(language) ? prev.filter(lang => lang !== language) : [...prev, language]
        );
    };

    return (
        <div className="flex h-screen w-full flex-col">
        {/* Header */}
        <Header fullName={fullName} />
        <div className="flex flex-1 w-full">
            {/* Sidebar */}
            <div className="w-20 bg-[#004098CC] text-white flex flex-col items-center py-6 space-y-6 relative">
            <div className="flex flex-col items-center space-y-4 mt-6">
                <MdTranslate size={32} />
                <span className="text-xs">Translate</span>
                <hr className="w-10 border-white" />
                <MdHistory size={32} />
                <span className="text-xs">File history</span>
            </div>
            <div className="absolute bottom-10 flex flex-col items-center text-center">
                <MdSettings size={32} />
                <span className="text-xs leading-tight">Update Vocabulary</span>
            </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-6">
            {/* Language Select */}
            <div className="flex justify-between items-center w-2/3 mb-6 border-b border-blue-700 p-2 bg-gray-100 rounded relative">
                <button
                className="p-2 text-gray-700 bg-white border rounded w-1/2 text-left"
                onClick={() => setShowLanguages(!showLanguages)}
                >
                {selectedOriginLanguage}
                </button>
                {showLanguages && (
                <div className="absolute top-12 left-0 bg-white border rounded shadow-md w-1/2">
                    <ul>
                    {["English", "Japanese", "Chinese", "Vietnamese"].map((lang) => (
                        <li key={lang} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleOriginLanguageSelect(lang)}>
                        {lang}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
                <MdSwapHoriz size={32} className="text-gray-700 mx-4" />
                <button
                className="p-2 text-gray-700 bg-white border rounded w-1/2 text-left"
                onClick={() => setShowTargetDropdown(!showTargetDropdown)}
                >
                Target Language
                </button>
                {showTargetDropdown && (
                <div className="absolute top-12 right-0 bg-white border rounded shadow-md w-1/2 max-h-40 overflow-auto">
                    <ul>
                    {availableTargetLanguages.map((lang) => (
                        <li key={lang} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                        <input type="checkbox" checked={selectedTargetLanguages.includes(lang)} onChange={() => handleTargetLanguageSelect(lang)} className="mr-2" />
                        {lang}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-400 bg-white p-10 rounded-lg flex flex-col items-center">
                <div className="text-gray-400 text-6xl">☁️</div>
                <p className="text-blue-600 font-semibold">Drag and drop</p>
                <p className="text-gray-500">Or</p>
                <button className="bg-gray-300 px-4 py-2 rounded font-bold">Browse</button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default HomePage;