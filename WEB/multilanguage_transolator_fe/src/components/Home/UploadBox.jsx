import React, { useState } from "react";

const LanguageUploadSection = ({ onSelectOrigin, onSelectTarget }) => {
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedOriginLanguage, setSelectedOriginLanguage] = useState("Origin Language");
  const [availableTargetLanguages, setAvailableTargetLanguages] = useState(["English", "Japanese", "Chinese", "Vietnamese"]);
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState([]);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [files, setFiles] = useState([]); 

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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="border-b-2 border-blue-700 flex items-center justify-between p-2 w-full bg-gray-100 relative mt-4">
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

      <div className="w-full bg-white rounded-lg flex flex-col items-center text-center border border-gray-300 p-8 md:p-16 shadow-md h-auto mt-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-gray-400 text-7xl md:text-9xl">☁️</div>
        <p className="text-blue-600 font-semibold text-lg md:text-xl mt-2">Drag and drop</p>
        <p className="text-gray-500 text-sm md:text-md mb-4">Or</p>
        <label 
          htmlFor="fileInput"
          className="bg-gray-300 px-6 py-3 md:px-8 md:py-4 rounded font-bold text-lg md:text-xl cursor-pointer inline-block"
        >
          Browse
        </label>
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          multiple 
          onChange={handleFileChange} 
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6 w-full bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <span>{file.name}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageUploadSection;
