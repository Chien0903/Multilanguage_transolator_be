import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaSearch, FaSort } from "react-icons/fa";
import { FiDownload, FiUpload, FiExternalLink, FiX } from "react-icons/fi";

const fileIcons = {
  pdf: <FaFilePdf className="text-red-500 w-5 h-5" />,
  docx: <FaFileWord className="text-blue-500 w-5 h-5" />,
  xlsx: <FaFileExcel className="text-green-500 w-5 h-5" />,
};

const files = [
  { id: 1, name: "Toray.pdf", lang: "Japanese", date: "1/2/2025", type: "pdf" },
  { id: 2, name: "Toray.docx", lang: "Vietnamese", date: "1/1/2025", type: "docx" },
  { id: 3, name: "Toray.xlsx", lang: "Chinese", date: "1/12/2024", type: "xlsx" },
  { id: 4, name: "THK.pdf", lang: "English", date: "1/11/2025", type: "pdf" },
  { id: 5, name: "THK.docx", lang: "Japanese", date: "1/10/2025", type: "docx" },
];

const FileHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedFile, setSelectedFile] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [fileToDelete, setFileToDelete] = useState(null);
  
  // Function to calculate rows based on screen height
  const calculateItemsPerPage = () => {
    const rowHeight = 50;
    const navbarHeight = 60;
    const headerHeight = 110;
    const paginationHeight = 60;
    const tableHeaderHeight = 54;
    const safetyBuffer = 20;
    
    const totalNonTableHeight = navbarHeight + headerHeight + paginationHeight + tableHeaderHeight + safetyBuffer;
    const availableHeight = window.innerHeight - totalNonTableHeight;
    
    const calculatedRows = Math.max(1, Math.floor(availableHeight / rowHeight));
    return Math.min(calculatedRows - 1, 15);
  };

  // Update items per page when window is resized
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowHeight]);

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => {
      return file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.lang.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "date_asc":
          return new Date(a.date) - new Date(b.date);
        case "date_desc":
          return new Date(b.date) - new Date(a.date);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Xử lý tải xuống file
  const handleDownload = (file) => {
    console.log("Downloading file:", file.name);
    
    const link = document.createElement('a');
    link.href = `/api/files/download/${file.id}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Downloading ${file.name}`);
  };
  
  // Xử lý mở file trong cửa sổ mới
  const handleOpenInNewTab = (file) => {
    console.log("Opening file in new tab:", file.name);
    
    const fileViewerUrl = `/view-file/${file.id}`;
    
    window.open(fileViewerUrl, '_blank');
  };
  
  // Xử lý xóa file
  const handleDelete = (fileId) => {
    console.log("Deleting file with ID:", fileId);
    
    const updatedFiles = files.filter(file => file.id !== fileId);
    console.log("Files after deletion:", updatedFiles);
    
    setFileToDelete(null);
    
    alert("File deleted successfully!");
  };
  
  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <div className="flex p-2 flex-1 flex-col h-full overflow-hidden">
        {/* Header section with search and filters */}
        <div className="bg-[#004098CC] p-3 rounded flex flex-wrap items-center text-white gap-4">
          <div className="text-lg font-semibold">File History</div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-black z-10" />
              <input
                type="text"
                placeholder="Search files..."
                className="p-2 pl-10 border rounded w-full bg-white text-black placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-64">
              <FaSort className="absolute left-3 top-3 text-black z-10" />
              <select
                className="p-2 pl-10 border rounded w-full bg-white text-black"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="name_asc">Sort by Name (A-Z)</option>
                <option value="name_desc">Sort by Name (Z-A)</option>
                <option value="date_asc">Sort by Date (Oldest)</option>
                <option value="date_desc">Sort by Date (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="overflow-auto flex-1">
          <table className="w-full border border-gray-400 rounded-sm overflow-hidden text-center">
            <thead>
              <tr className="bg-white text-black font-bold border-b-2 border-gray-400">
                <th className="p-3 border-2 border-gray-300 w-[5%]">No</th>
                <th className="p-3 border-2 border-gray-300 w-[35%]">Name</th>
                <th className="p-3 border-2 border-gray-300 w-[20%]">Language</th>
                <th className="p-3 border-2 border-gray-300 w-[20%]">Date</th>
                <th className="p-3 border-2 border-gray-300 w-[20%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((file, index) => (
                <tr 
                  key={file.id} 
                  className="border-2 border-gray-300 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  <td className="p-3 border-2 border-gray-300">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="p-3 border-2 border-gray-300">
                    <div className="flex items-center space-x-2 justify-center">
                      {fileIcons[file.type]}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-2 border-gray-300">{file.lang}</td>
                  <td className="p-3 border-2 border-gray-300">{file.date}</td>
                  <td className="p-3 border-2 border-gray-300">
                    <div className="flex justify-center space-x-4">
                      <button
                        className="p-2 bg-blue-100 rounded-md hover:bg-blue-200 flex items-center justify-center transition-colors"
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                      >
                        <FiDownload className="text-blue-600 w-5 h-5" />
                      </button>
                      <button
                        className="p-2 bg-green-100 rounded-md hover:bg-green-200 flex items-center justify-center transition-colors"
                        title="Upload"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Upload file:", file.name);
                        }}
                      >
                        <FiUpload className="text-green-600 w-5 h-5" />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center justify-center transition-colors"
                        title="Open in new window"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInNewTab(file);
                        }}
                      >
                        <FiExternalLink className="text-gray-600 w-5 h-5" />
                      </button>
                      <button
                        className="p-2 bg-red-100 rounded-md hover:bg-red-200 flex items-center justify-center transition-colors"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileToDelete(file);
                        }}
                      >
                        <FiX className="text-red-500 w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        <div className="flex justify-center py-4 h-min">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-4 self-center">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        
        {/* File detail modal */}
        {selectedFile && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            onClick={() => setSelectedFile(null)}
          >
            <div
              className="bg-white p-6 rounded shadow-lg max-w-2xl w-11/12 max-h-[90vh] overflow-auto text-center"
              style={{ border: "2px solid #ccc" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">FILE DETAILS</h3>
              <div className="overflow-x-auto">
                <table className="border-collapse border-2 border-gray-400 w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border-2 border-gray-300">Property</th>
                      <th className="p-3 border-2 border-gray-300">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-2 border-gray-300">File Name</td>
                      <td className="p-3 border-2 border-gray-300">
                        <div className="flex items-center space-x-2 justify-center">
                          {fileIcons[selectedFile.type]}
                          <span>{selectedFile.name}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-2 border-gray-300">Language</td>
                      <td className="p-3 border-2 border-gray-300">{selectedFile.lang}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-2 border-gray-300">Date</td>
                      <td className="p-3 border-2 border-gray-300">{selectedFile.date}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-2 border-gray-300">File Type</td>
                      <td className="p-3 border-2 border-gray-300">{selectedFile.type.toUpperCase()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <FiDownload className="mr-2" /> Download
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
                  onClick={() => handleOpenInNewTab(selectedFile)}
                >
                  <FiExternalLink className="mr-2" /> Open in new window
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setSelectedFile(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete confirmation modal */}
        {fileToDelete && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="bg-white p-6 rounded shadow-lg w-96 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete the file "{fileToDelete.name}"?</p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(fileToDelete.id)}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setFileToDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileHistory;
