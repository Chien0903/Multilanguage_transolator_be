import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spin, notification } from "antd";
import api from "../../services/api";

const TranslationResults = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [originalFile, setOriginalFile] = useState(null);
  const [translatedFiles, setTranslatedFiles] = useState([]);
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    const fetchTranslationResults = async () => {
      if (!location.state?.fileData) {
        notification.error({
          message: "Error",
          description: "No translation data provided."
        });
        setLoading(false);
        return;
      }

      try {
        const { fileData, originLanguage, targetLanguages } = location.state;
        
        // For demo purposes, we'll simulate an API call delay
        setTimeout(() => {
          // Set the original file
          setOriginalFile({
            uri: fileData.uri,
            fileType: fileData.fileType
          });
          
          // Create mock translated files for demo
          // In a real app, you would get these from your API
          const mockTranslatedFiles = targetLanguages.map(lang => ({
            language: lang,
            uri: fileData.uri, // Using same file for demo
            fileType: fileData.fileType
          }));
          
          setTranslatedFiles(mockTranslatedFiles);
          setOriginalLanguage(originLanguage);
          setSelectedLanguage(targetLanguages[0]);
          setLoading(false);
        }, 2000); // Simulate 2 second API delay
        
        // In a real implementation, you'd make an API call:
        // const response = await api.post("/api/translate", {
        //   fileUri: fileData.uri,
        //   sourceLanguage: originLanguage,
        //   targetLanguages: targetLanguages
        // });
        // setTranslatedFiles(response.data.translatedFiles);
      } catch (error) {
        console.error("Error fetching translation results:", error);
        notification.error({
          message: "Error",
          description: "Failed to load translation results."
        });
        setLoading(false);
      }
    };

    fetchTranslationResults();
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spin size="large" />
        <p className="mt-4 text-lg">Translating your document...</p>
        <p className="text-sm text-gray-500">This may take a few moments.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white p-4">
      <div className="flex mb-6 items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="px-6 py-2 rounded-full border border-gray-300 bg-[#E9F9F9] text-black shadow-sm font-medium">
            {originalLanguage}
          </button>
          <div className="text-blue-500 mx-4">
            <svg width="28" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {translatedFiles.map((file) => (
            <button
              key={file.language}
              className={`px-6 py-2 rounded-full transition-colors font-medium border shadow-sm ${
                file.language === selectedLanguage
                  ? "bg-[#E9F9F9] text-black border-blue-500"
                  : "bg-white text-black border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedLanguage(file.language)}
            >
              {file.language}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-1/2 border rounded-lg overflow-hidden">
          <div style={{ height: "calc(85vh - 130px)" }}>
            {renderDocumentViewer(originalFile)}
          </div>
        </div>
        
        <div className="w-1/2 border rounded-lg overflow-hidden">
          <div style={{ height: "calc(85vh - 130px)" }}>
            {renderDocumentViewer(
              translatedFiles.find(file => file.language === selectedLanguage) || translatedFiles[0]
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to render the appropriate document viewer
const renderDocumentViewer = (file) => {
  if (!file) return null;

  switch (file.fileType) {
    case "pdf":
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.uri)}&embedded=true`}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
          title="PDF Viewer"
        />
      );
    case "docx":
    case "xlsx":
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.uri)}`}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
          title={`${file.fileType.toUpperCase()} Viewer`}
        />
      );
    default:
      return <div className="text-center p-4">Unsupported file format</div>;
  }
};

export default TranslationResults;
