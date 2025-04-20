import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Progress, notification, Modal } from "antd";
import WebViewer from "@pdftron/webviewer";

const LANGUAGE_CODES = {
  English: "en",
  Japanese: "ja",
  "Chinese (Simplified)": "zh-CN",
  "Chinese (Traditional)": "zh-TW",
  Vietnamese: "vi",
};

const UploadFile = () => {
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
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempFileData, setTempFileData] = useState(null);
  const [isHighlightModalVisible, setIsHighlightModalVisible] = useState(false);
  const viewerRef = useRef(null);
  const webViewerInstanceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (uploadProgress === 100 && tempFileData) {
      setFile({ uri: tempFileData.publicUrl, fileType: tempFileData.fileType });
      setTempFileData(null);
    }
  }, [uploadProgress, tempFileData]);

  useEffect(() => {
    if (isHighlightModalVisible && file && file.fileType === "pdf" && viewerRef.current) {
      WebViewer(
        {
          path: "lib/webviewer",
          initialDoc: file.uri,
          licenseKey: "demo:1743049584934:612ba0cd0300000000473c15e33bb44345d450ebbb5e1c4b70c47d5e0f",
          fullAPI: true,
          disableVirtualDisplay: true,
        },
        viewerRef.current
      ).then((instance) => {
        webViewerInstanceRef.current = instance;
        const { documentViewer, annotationManager } = instance.Core;

        documentViewer.addEventListener("documentLoaded", () => {
          console.log("PDF loaded successfully in WebViewer");
          documentViewer.setFitMode(documentViewer.FitMode.FitHeight);

          instance.UI.setToolMode("AnnotationCreateTextHighlight");
        });

        documentViewer.addEventListener("mouseMove", (e) => {
          const { x, y } = e;
          console.log("WebViewer Mouse coordinates:", x, y);
        });
      }).catch((error) => {
        console.error("WebViewer initialization error:", error);
        webViewerInstanceRef.current = null;
      });
    }

    return () => {
      if (webViewerInstanceRef.current && typeof webViewerInstanceRef.current.UI?.dispose === "function") {
        try {
          webViewerInstanceRef.current.UI.dispose();
        } catch (error) {
          console.error("Error disposing WebViewer:", error);
        }
        webViewerInstanceRef.current = null;
      }
    };
  }, [isHighlightModalVisible, file]);

  const handleOriginLanguageSelect = (language) => {
    setSelectedOriginLanguage(language);
    setShowLanguages(false);

    // Loại bỏ ngôn ngữ nguồn khỏi target list
    let filtered = Object.keys(LANGUAGE_CODES).filter((l) => l !== language);
    // nếu chọn Traditional/ Simplified thì tránh hiển thị cặp còn lại
    if (language === "Chinese (Traditional)") {
      filtered = filtered.filter((l) => l !== "Chinese (Simplified)");
    }
    if (language === "Chinese (Simplified)") {
      filtered = filtered.filter((l) => l !== "Chinese (Traditional)");
    }
    setAvailableTargetLanguages(filtered);
    setSelectedTargetLanguages([]);
  };

  const handleTargetLanguageSelect = (language) => {
    setSelectedTargetLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
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
      const fakeProgressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress < 95) {
            return prevProgress + 5;
          }
          return prevProgress;
        });
      }, 500);

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const response = await api.post("/api/file/upload-to-s3/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { publicUrl } = response.data;
      console.log("Public URL:", publicUrl);

      clearInterval(fakeProgressInterval);
      setUploadProgress(100);

      setTempFileData({ publicUrl, fileType: ext });

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
    setIsHighlightModalVisible(false);
  };

  const handleHighlight = () => {
    if (file.fileType !== "pdf") {
      notification.warning({
        message: "Unsupported Format",
        description: "Highlighting is only supported for PDF files.",
      });
      return;
    }
    setIsHighlightModalVisible(true);
  };

  const handleSave = async () => {
    if (!webViewerInstanceRef.current) {
      notification.error({
        message: "Error",
        description: "WebViewer is not initialized.",
      });
      return;
    }

    try {
      const { documentViewer, annotationManager } = webViewerInstanceRef.current.Core;

      const doc = documentViewer.getDocument();
      const xfdfString = await annotationManager.exportAnnotations();
      const data = await doc.getFileData({ xfdfString });
      const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });

      const formData = new FormData();
      formData.append("file", blob, "highlighted.pdf");

      const response = await api.post("/api/file/upload-to-s3/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { publicUrl } = response.data;
      console.log("Updated Public URL:", publicUrl);

      setFile({ uri: publicUrl, fileType: "pdf" });
      setIsHighlightModalVisible(false);

      notification.success({
        message: "File Saved",
        description: "The highlighted PDF has been saved successfully.",
      });
    } catch (error) {
      console.error("Save error:", error);
      notification.error({
        message: "Save Failed",
        description:
          "An error occurred while saving the file: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const handleTranslateClick = async () => {
    if (!file) {
      notification.error({ message: "No File Selected", description: "Vui lòng upload file trước khi dịch." });
      return;
    }
    if (selectedOriginLanguage === "Origin Language") {
      notification.error({ message: "Origin Language Required", description: "Vui lòng chọn ngôn ngữ nguồn." });
      return;
    }
    if (selectedTargetLanguages.length === 0) {
      notification.error({ message: "Target Language Required", description: "Vui lòng chọn ít nhất 1 ngôn ngữ đích." });
      return;
    }
    try {
      // Gọi API dịch file
      const payload = {
        file_url: file.uri,
        origin_language:  LANGUAGE_CODES[selectedOriginLanguage],
        target_languages: selectedTargetLanguages.map((l) => LANGUAGE_CODES[l]),
      };
      console.log("Payload for translation:", payload);
      const response = await api.post("/api/translate/", payload);
      console.log("Translation response:", response.data);
      // Chuyển sang trang kết quả
      navigate("/translation-results", {
        state: {
          originalFile: file,
          originalLanguage: selectedOriginLanguage,
          translatedFiles: response.data.translated_files, // [{ language: "Japanese", url: "..." }, ...]
        },
      });
    } catch (error) {
      console.error("Translation error:", error);
      notification.error({
        message: "Translation Failed",
        description: error.response?.data?.detail || error.message,
      });
    }
  };
  
  return (
    <div className="w-full items-center justify-center bg-white  overflow-hidden ">
      <div className="border-b-2 border-blue-700 flex flex-wrap items-center justify-between p-2 w-full bg-gray-100 ">
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

      {!file && (
        <div
          className="w-full bg-white rounded-lg flex flex-col items-center text-center border border-gray-300 p-8 md:p-16 shadow-md mt-4"
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
                accept=".pdf,.docx,.xlsx"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      )}

      {file && (
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            File Preview
            <div className="space-x-2">
              <button
                onClick={() => window.open(file.uri, "_blank")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Open
              </button>
              <button
                onClick={handleHighlight}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Highlight
              </button>
              <button
                onClick={handleRemoveFile}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove File
              </button>
            </div>
          </h3>

          <div className="iframe-container" style={{ height: "calc(70vh - 100px)", overflow: "hidden" }}>
            {file.fileType === "docx" && (
              <iframe
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                  file.uri
                )}`}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
                title="DOCX Viewer"
              />
            )}

            {file.fileType === "xlsx" && (
              <iframe
                src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                  file.uri
                )}`}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
                title="XLSX Viewer"
              />
            )}

            {file.fileType === "pdf" && (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  file.uri
                )}&embedded=true`}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
                title="PDF Viewer"
              />
            )}
          </div>
        </div>
      )}

      <Modal
        title="Highlight PDF"
        open={isHighlightModalVisible}
        onCancel={() => setIsHighlightModalVisible(false)}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        styles={{ body: { height: "70vh", overflow: "hidden" } }}
      >
        <div className="w-full h-full">
          <div className="flex justify-end mb-2 space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsHighlightModalVisible(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>

          <div
            ref={viewerRef}
            style={{ width: "100%", height: "100%", position: "relative" }}
          />
        </div>
      </Modal>

      <div className="w-full flex justify-end mt-2">
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded shadow hover:bg-blue-600"
          onClick={handleTranslateClick}
          disabled={!file}
        >
          Translate
        </button>
      </div>
    </div>
  );
};

export default UploadFile;