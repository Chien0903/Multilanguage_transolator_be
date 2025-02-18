import React, { useState } from "react";

const LanguageSelect = ({ onSelectOrigin, onSelectTarget }) => {
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
    onSelectOrigin(language);
  };

  const handleTargetLanguageSelect = (language) => {
    setSelectedTargetLanguages(prev =>
      prev.includes(language) ? prev.filter(lang => lang !== language) : [...prev, language]
    );
    onSelectTarget(language);
  };

  return (
    <div className="border-b-2 border-blue-700 flex items-center justify-between p-2 w-full bg-gray-100 relative mt-4">
      {/* Chọn ngôn ngữ gốc */}
      <button className="bg-gray-300 px-3 py-2 rounded flex items-center text-sm" onClick={() => setShowLanguages(!showLanguages)}>
        {selectedOriginLanguage} <span className="ml-1">▼</span>
      </button>
      {showLanguages && (
        <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow-md w-28 z-10">
          <ul>
            {["English", "Japanese", "Chinese", "Vietnamese"].map((lang) => (
              <li key={lang} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleOriginLanguageSelect(lang)}>
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chọn ngôn ngữ đích */}
      <button className="bg-gray-300 px-3 py-2 rounded flex items-center text-sm" onClick={() => setShowTargetDropdown(!showTargetDropdown)}>
        Target Language <span className="ml-2">▼</span>
      </button>
      {showTargetDropdown && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-40 max-h-40 overflow-auto z-10">
          <ul>
            {availableTargetLanguages.map((lang) => (
              <li 
                key={lang} 
                className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                onClick={() => handleTargetLanguageSelect(lang)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTargetLanguages.includes(lang)} 
                  readOnly 
                  className="mr-2 pointer-events-none" 
                />
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;