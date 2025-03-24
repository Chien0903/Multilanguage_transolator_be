import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { Progress, notification } from "antd";

const UploadFile = ({ onSelectOrigin, onSelectTarget, onTranslate }) => {
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedOriginLanguage, setSelectedOriginLanguage] = useState("Origin Language");
  const [availableTargetLanguages, setAvailableTargetLanguages] = useState([
    "English",
    "Japanese",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Vietnamese",
  ]);
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState([]);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  // State lưu file duy nhất { uri, fileType }
  const [file, setFile] = useState(null);

  // Trạng thái upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State tạm để lưu publicUrl và fileType
  const [tempFileData, setTempFileData] = useState(null);

  // Theo dõi uploadProgress để hiển thị file khi đạt 100%
  useEffect(() => {
    if (uploadProgress === 100 && tempFileData) {
      setFile({ uri: tempFileData.publicUrl, fileType: tempFileData.fileType });
      setTempFileData(null); // Xóa dữ liệu tạm sau khi hiển thị

      // Scroll to the bottom of the page smoothly
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [uploadProgress, tempFileData]);

  const handleOriginLanguageSelect = (language) => {
    setSelectedOriginLanguage(language);
    setShowLanguages(false);

    let filteredLanguages = [
      "English",
      "Japanese",
      "Chinese (Simplified)",
      "Chinese (Traditional)",
      "Vietnamese",
    ].filter((lang) => lang !== language);

    if (language === "Chinese (Traditional)") {
      filteredLanguages = filteredLanguages.filter(
        (lang) => lang !== "Chinese (Simplified)"
      );
    } else if (language === "Chinese (Simplified)") {
      filteredLanguages = filteredLanguages.filter(
        (lang) => lang !== "Chinese (Traditional)"
      );
    }

    setAvailableTargetLanguages(filteredLanguages);
    setSelectedTargetLanguages([]);
    onSelectOrigin(language);
  };

  const handleTargetLanguageSelect = (language) => {
    setSelectedTargetLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );
    onSelectTarget(language);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      uploadFile(selectedFiles[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      uploadFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const uploadFile = async (fileToUpload) => {
    const ext = fileToUpload.name.split(".").pop()?.toLowerCase();
    const allowedFormats = ["pdf", "docx", "xlsx"];

    if (!ext || !allowedFormats.includes(ext)) {
      notification.error({
        message: "Invalid Format",
        description: "Only PDF, DOCX, and XLSX are supported.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Tạo fake progress
      const fakeProgressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress < 95) {
            return prevProgress + 5;
          }
          return prevProgress;
        });
      }, 500);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // Gửi file lên backend
      const response = await api.post("/api/file/upload-to-s3/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { publicUrl } = response.data;
      console.log("Public URL:", publicUrl);

      // Dừng fake progress và đặt progress thành 100%
      clearInterval(fakeProgressInterval);
      setUploadProgress(100);

      // Lưu tạm publicUrl và fileType, chờ progress đạt 100%
      setTempFileData({ publicUrl, fileType: ext });

      // Đợi 500ms trước khi ẩn thanh progress
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      notification.error({
        message: "Upload Failed",
        description:
          "An error occurred while uploading the file: " +
          (error.response?.data?.error || error.message),
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full items-center justify-center bg-white p-6">
      {/* Dropdown chọn ngôn ngữ */}
      <div className="border-b-2 border-blue-700 flex flex-wrap items-center justify-between p-2 w-full bg-gray-100 mt-4">
        <div className="flex items-center mb-2 sm:mb-0 relative">
          <button
            className="bg-gray-300 px-3 py-2 rounded flex items-center justify-between text-sm mr-4 w-44"
            onClick={() => setShowLanguages(!showLanguages)}
          >
            <span>{selectedOriginLanguage}</span> <span>▼</span>
          </button>
          {showLanguages && (
            <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow-md w-44 z-10">
              <ul>
                {[
                  "English",
                  "Japanese",
                  "Chinese (Simplified)",
                  "Chinese (Traditional)",
                  "Vietnamese",
                ].map((lang) => (
                  <li
                    key={lang}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleOriginLanguageSelect(lang)}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center relative">
          <button
            className="bg-gray-300 px-3 py-2 rounded flex items-center justify-between text-sm w-46"
            onClick={() => setShowTargetDropdown(!showTargetDropdown)}
          >
            <span>Target Language</span> <span>▼</span>
          </button>
          {showTargetDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-md w-46 z-10">
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
      </div>

      {/* Khu vực upload */}
      {!file && (
        <div
          className="w-full bg-white rounded-lg flex flex-col items-center text-center border border-gray-300 p-8 md:p-16 shadow-md h-auto mt-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {uploading ? (
            <div className="w-full">
              <p className="text-blue-600 font-semibold text-lg md:text-xl mt-2">
                Uploading... {uploadProgress}%
              </p>
              <Progress percent={uploadProgress} status="active" />
            </div>
          ) : (
            <>
              <div className="text-gray-400 text-7xl md:text-9xl">☁️</div>
              <p className="text-blue-600 font-semibold text-lg md:text-xl mt-2">
                Drag and drop
              </p>
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
                accept=".pdf,.docx,.xlsx,.txt"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      )}

      {/* Hiển thị file đã upload */}
      {file && (
        <div className="mt-6 w-full bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            File Preview
            <div>
              <button
                onClick={() => window.open(file.uri, "_blank")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
              >
                Mở
              </button>
              <button
                onClick={handleRemoveFile}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove File
              </button>
            </div>
          </h3>

          {file.fileType === "docx" && (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                file.uri
              )}`}
              style={{ width: "100%", height: "800px" }}
              frameBorder="0"
              title="DOCX Viewer"
            />
          )}

          {file.fileType === "xlsx" && (
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                file.uri
              )}`}
              style={{ width: "100%", height: "800px" }}
              frameBorder="0"
              title="XLSX Viewer"
            />
          )}

          {file.fileType === "pdf" && (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                file.uri
              )}&embedded=true`}
              style={{ width: "100%", height: "800px" }}
              frameBorder="0"
              title="PDF Viewer"
            />
          )}
        </div>
      )}

      <div className="w-full flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded shadow hover:bg-blue-600"
          onClick={onTranslate}
          disabled={!file}
        >
          Translate
        </button>
      </div>
    </div>
  );
};

export default UploadFile;