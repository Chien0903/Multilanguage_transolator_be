import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import pdfFile from "../../../../../../Bachelor-Hedspi-program.pdf";

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

  // Xử lý chọn file từ input hoặc kéo thả
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    processFiles(newFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    processFiles(newFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Xử lý danh sách file
  const processFiles = (newFiles) => {
    const fileUrls = newFiles.map(file => ({
      uri: URL.createObjectURL(file), // Chuyển file thành URL để hiển thị
      fileType: file.name.split('.').pop(), 
    }));
    setFiles(fileUrls);
  };

  // Xóa file và hiển thị lại khu vực tải lên
  const handleRemoveFile = () => {
    setFiles([]); // Xóa file, hiển thị lại ô upload
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
        {/* Upload Box (Ẩn khi có file) */}
      {files.length === 0 && (
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
            accept=".pdf,.docx,.txt,.xlsx"
            onChange={handleFileChange} 
          />
        </div>
      )}

      {/* Hiển thị nội dung file */}
      {files.length > 0 && (
        <div className="mt-6 w-full bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            File Preview
            <button 
              onClick={handleRemoveFile} 
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove File
            </button>
          </h3>
          <DocViewer documents={files} pluginRenderers={DocViewerRenderers} />
        </div>
      )}
    </div>
  );
};

export default LanguageUploadSection;
