import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spin, notification } from "antd";

const TranslationResults = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);

  // Những dữ liệu được truyền từ UploadFile
  const { originalFile, originalLanguage, translatedFiles } = state || {};
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    if (!originalFile || !translatedFiles) {
      notification.error({ message: "Error", description: "No translation data provided." });
      setLoading(false);
      return;
    }
    // Mặc định chọn file đầu tiên
    setSelectedLanguage(translatedFiles[0].language);
    setLoading(false);
  }, [originalFile, translatedFiles]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spin size="large" />
        <p className="mt-4 text-lg">Translating your document...</p>
        <p className="text-sm text-gray-500">This may take a few moments.</p>
      </div>
    );
  }

  const renderDocumentViewer = (file) => {
    if (!file) return null;
    const uri = file.url || file.uri;
    const ext = uri.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(uri)}&embedded=true`}
          className="w-full h-full"
          frameBorder="0"
          title="PDF Viewer"
        />
      );
    }
    // docx/xlsx
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(uri)}`}
        className="w-full h-full"
        frameBorder="0"
        title={`${ext.toUpperCase()} Viewer`}
      />
    );
  };

  return (
    <div className="container mx-auto bg-white p-4">
      {/* Chọn ngôn ngữ */}
      <div className="flex mb-6 items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="px-6 py-2 rounded-full border bg-[#E9F9F9] font-medium">
            {originalLanguage} (Original)
          </button>
          <div className="text-blue-500 mx-4">
            {/* icon ↔ */}
            <svg width="28" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" />
              <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="flex space-x-2">
          {translatedFiles.map((file) => (
            <button
              key={file.language}
              className={`px-6 py-2 rounded-full border font-medium ${
                file.language === selectedLanguage
                  ? "bg-[#E9F9F9] border-blue-500"
                  : "bg-white border-gray-300 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedLanguage(file.language)}
            >
              {file.language}
            </button>
          ))}
        </div>
      </div>

      {/* Hai khung hiển thị */}
      <div className="flex space-x-4">
        {/* Original */}
        <div className="w-1/2 border rounded-lg overflow-hidden h-[80vh]">
          {renderDocumentViewer(originalFile)}
        </div>
        {/* Translated */}
        <div className="w-1/2 border rounded-lg overflow-hidden h-[80vh]">
          {renderDocumentViewer(
            translatedFiles.find((f) => f.language === selectedLanguage)
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationResults;
