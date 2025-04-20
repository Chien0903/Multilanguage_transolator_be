import React, { useState, useEffect } from "react";
import { FaSearch, FaSort, FaEdit, FaTrash, FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import api from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";

const UserLibraryManagement = () => {
  const [keywords, setKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("id_asc");
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newKeyword, setNewKeyword] = useState({
    original_word: "",
    target_word: "",
    original_language: "Japanese",
    target_language: "English",
  });
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    if (!loading) {
      handleResize();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowHeight, loading]);

  useEffect(() => {
    if (!loading) {
      setItemsPerPage(calculateItemsPerPage());
    }
  }, [searchTerm, sortOrder, loading]);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await api.get("/api/common-keyword/");
        setKeywords(res.data);
      } catch (error) {
        toast.error("Failed to fetch common keywords!", {
          style: { backgroundColor: "red", color: "white" },
          icon: <FiAlertCircle />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/common-keyword/${id}/`);
      const res = await api.get("/api/common-keyword/");
      setKeywords(res.data);
      toast.success("Common keyword deleted successfully!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiAlertCircle />,
      });
    } catch (error) {
      toast.error("Failed to delete common keyword!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
    }
  };

  const handleEdit = (keyword) => {
    setEditingKeyword({ ...keyword });
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/common-keyword/${editingKeyword.id}/`, editingKeyword);
      setKeywords(
        keywords.map((item) => (item.id === editingKeyword.id ? res.data : item))
      );
      setEditingKeyword(null);
      toast.success("Common keyword updated successfully!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiAlertCircle />,
      });
    } catch (error) {
      toast.error("Failed to update common keyword!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingKeyword({ ...editingKeyword, [name]: value });
  };

  const handleAddKeyword = async () => {
    if (
      !newKeyword.original_word ||
      !newKeyword.target_word ||
      !newKeyword.original_language ||
      !newKeyword.target_language
    ) {
      toast.error("All fields are required!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
      return;
    }

    if (newKeyword.original_language === newKeyword.target_language) {
      toast.error("Original and target language cannot be the same!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
      return;
    }

    try {
      console.log("Sending data to API:", newKeyword);

      const apiData = {
        japanese: newKeyword.original_language === "Japanese" ? newKeyword.original_word : 
                  newKeyword.target_language === "Japanese" ? newKeyword.target_word : "",
        english: newKeyword.original_language === "English" ? newKeyword.original_word : 
                newKeyword.target_language === "English" ? newKeyword.target_word : "",
        vietnamese: newKeyword.original_language === "Vietnamese" ? newKeyword.original_word : 
                    newKeyword.target_language === "Vietnamese" ? newKeyword.target_word : "",
        chinese_traditional: newKeyword.original_language === "Chinese (Traditional)" ? newKeyword.original_word : 
                             newKeyword.target_language === "Chinese (Traditional)" ? newKeyword.target_word : "",
        chinese_simplified: newKeyword.original_language === "Chinese (Simplified)" ? newKeyword.original_word : 
                            newKeyword.target_language === "Chinese (Simplified)" ? newKeyword.target_word : "",
      };

      console.log("Transformed API data:", apiData);

      const res = await api.post("/api/common-keyword/", apiData);
      console.log("API response:", res.data);
      
      setKeywords((prevKeywords) => [...prevKeywords, res.data]);
      setNewKeyword({
        original_word: "",
        target_word: "",
        original_language: "Japanese",
        target_language: "English",
      });
      setIsAddingKeyword(false);
      toast.success("Common keyword added successfully!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiAlertCircle />,
      });
    } catch (error) {
      console.error("Error adding keyword:", error);
      console.error("Error response:", error.response);
      
      let errorMsg = "Failed to add common keyword!";
      
      if (error.response) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          errorMsg = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
      }
      
      toast.error(errorMsg, {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
    }
  };

  const handleImport = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const importedKeywords = XLSX.utils.sheet_to_json(worksheet);
      const standardizedKeywords = importedKeywords.map((keyword) => ({
        original_word: keyword.original_word || "",
        target_word: keyword.target_word || "",
        original_language: keyword.original_language || "Japanese",
        target_language: keyword.target_language || "English",
      }));

      const saveImportedKeywords = async () => {
        try {
          for (const keyword of standardizedKeywords) {
            if (
              !keyword.original_word ||
              !keyword.target_word ||
              !keyword.original_language ||
              !keyword.target_language
            ) {
              toast.error("Imported data is missing required fields!", {
                style: { backgroundColor: "red", color: "white" },
                icon: <FiAlertCircle />,
              });
              return;
            }
            const apiData = {
              japanese: keyword.original_language === "Japanese" ? keyword.original_word : "",
              english: keyword.original_language === "English" ? keyword.original_word : 
                      keyword.target_language === "English" ? keyword.target_word : "",
              vietnamese: keyword.original_language === "Vietnamese" ? keyword.original_word : 
                          keyword.target_language === "Vietnamese" ? keyword.target_word : "",
              chinese_traditional: keyword.original_language === "Chinese (Traditional)" ? keyword.original_word : 
                                   keyword.target_language === "Chinese (Traditional)" ? keyword.target_word : "",
              chinese_simplified: keyword.original_language === "Chinese (Simplified)" ? keyword.original_word : 
                                  keyword.target_language === "Chinese (Simplified)" ? keyword.target_word : "",
            };
            await api.post("/api/common-keyword/", apiData);
          }
          toast.success("Keywords imported successfully!", {
            style: { backgroundColor: "green", color: "white" },
            icon: <FiAlertCircle />,
          });
          const res = await api.get("/api/common-keyword/");
          setKeywords(res.data);
          fileInput.value = "";
        } catch (error) {
          const errorMsg =
            error.response?.data?.detail ||
            Object.values(error.response?.data || {}).join(", ") ||
            "Failed to save imported keywords!";
          toast.error(errorMsg, {
            style: { backgroundColor: "red", color: "white" },
            icon: <FiAlertCircle />,
          });
          fileInput.value = "";
        }
      };
      saveImportedKeywords();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const exportData = keywords.map((keyword) => ({
      original_word: keyword.japanese || "",
      target_word: keyword.english || "",
      original_language: "Japanese",
      target_language: "English",
      date_modified: keyword.date_modified || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Keywords");
    XLSX.writeFile(workbook, "keywords.xlsx");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    
    // Format as MM/DD/YY
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
  };

  const filteredKeywords = keywords
    .filter((item) => {
      const originalWord = item.japanese || "";
      const targetWord = item.english || "";

      return (
        originalWord.includes(searchTerm) ||
        targetWord.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = a.date_modified || "";
      const dateB = b.date_modified || "";

      switch (sortOrder) {
        case "id_asc":
          return a.id - b.id;
        case "id_desc":
          return b.id - a.id;
        case "date_asc":
          return dateA.localeCompare(dateB);
        case "date_desc":
          return dateB.localeCompare(dateA);
        default:
          return a.id - b.id;
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKeywords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isFormValid = () => {
    return (
      newKeyword.original_word.trim() !== "" &&
      newKeyword.target_word.trim() !== "" &&
      newKeyword.original_language !== newKeyword.target_language
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-min-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden ">
      <div className="flex p-2 flex-1 flex-col h-full overflow-hidden  ">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center px-4 py-2 rounded text-white bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsAddingKeyword(true)}
            >
              <FaPlus className="mr-2" /> Add Private Keyword
            </button>
            <label className="flex items-center px-4 py-2 bg-[#2F80ED] text-white rounded hover:bg-[#2967c7] cursor-pointer">
              <FaFileImport className="mr-2" /> Import
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImport}
              />
            </label>
            <button
              className="flex items-center px-4 py-2 bg-[#3B96AB] text-white rounded hover:bg-[#328699]"
              onClick={handleExport}
            >
              <FaFileExport className="mr-2" /> Export
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-black z-10" />
              <input
                type="text"
                placeholder="Search keyword..."
                className="p-2 pl-10 border border-gray-400 rounded w-full bg-white text-black placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-64">
              <FaSort className="absolute left-3 top-3 text-black z-10" />
              <select
                className="p-2 pl-10 border border-gray-400 rounded w-full bg-white text-black"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="id_asc">Sort by ID (Ascending)</option>
                <option value="id_desc">Sort by ID (Descending)</option>
                <option value="date_asc">Sort by Date (Ascending)</option>
                <option value="date_desc">Sort by Date (Descending)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#004098CC] text-white font-bold">
                <th className="p-3 border-b border-r border-gray-300 w-[5%] text-center">No</th>
                <th className="p-3 border-b border-r border-gray-300 w-[22%] text-center">Original Word</th>
                <th className="p-3 border-b border-r border-gray-300 w-[22%] text-center">Target Word</th>
                <th className="p-3 border-b border-r border-gray-300 w-[13%] text-center">Original Language</th>
                <th className="p-3 border-b border-r border-gray-300 w-[13%] text-center">Target Language</th>
                <th className="p-3 border-b border-r border-gray-300 w-[10%] text-center">Date Modified</th>
                <th className="p-3 border-b border-gray-300 w-[15%] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => setSelectedKeyword(item)}
                >
                  <td className="p-3 border-b border-r border-gray-200 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="p-3 border-b border-r border-gray-200 truncate max-w-[200px] text-center">
                    {item.japanese || ""}
                  </td>
                  <td className="p-3 border-b border-r border-gray-200 truncate max-w-[200px] text-center">
                    {item.english || ""}
                  </td>
                  <td className="p-3 border-b border-r border-gray-200 text-center">
                    Japanese
                  </td>
                  <td className="p-3 border-b border-r border-gray-200 text-center">
                    English
                  </td>
                  <td className="p-3 border-b border-r border-gray-200 text-center text-sm truncate">
                    {formatDate(item.date_modified)}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2 text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center py-4 h-min">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-4 self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {selectedKeyword && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            onClick={() => setSelectedKeyword(null)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-11/12 max-h-[90vh] overflow-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg text-[#004098CC] font-bold mb-4">PRIVATE KEYWORD DETAILS</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-[#004098CC] text-white">
                      <th className="p-3 border-b border-r border-gray-300 w-1/5 text-center">Original Word</th>
                      <th className="p-3 border-b border-r border-gray-300 w-1/5 text-center">Target Word</th>
                      <th className="p-3 border-b border-r border-gray-300 w-1/5 text-center">Original Language</th>
                      <th className="p-3 border-b border-r border-gray-300 w-1/5 text-center">Target Language</th>
                      <th className="p-3 border-b border-gray-300 w-1/5 text-center">Date Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-r border-gray-200 whitespace-normal break-words text-center">
                        {selectedKeyword.japanese}
                      </td>
                      <td className="p-3 border-b border-r border-gray-200 whitespace-normal break-words text-center">
                        {selectedKeyword.english}
                      </td>
                      <td className="p-3 border-b border-r border-gray-200 text-center">
                        Japanese
                      </td>
                      <td className="p-3 border-b border-r border-gray-200 text-center">
                        English
                      </td>
                      <td className="p-3 border-b border-gray-200 text-center">
                        {formatDate(selectedKeyword.date_modified)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setSelectedKeyword(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {editingKeyword && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            onClick={() => setEditingKeyword(null)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-11/12 max-h-[90vh] overflow-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg text-[#004098CC] font-bold mb-4">EDIT PRIVATE KEYWORD</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[#004098CC] text-white">
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Original Word</th>
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Target Word</th>
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Original Language</th>
                        <th className="p-3 border-b border-gray-300 w-1/4 text-center">Target Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border-b border-r border-gray-200">
                          <textarea
                            name="japanese"
                            value={editingKeyword.japanese}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded resize-y text-center"
                            required
                          />
                        </td>
                        <td className="p-3 border-b border-r border-gray-200">
                          <textarea
                            name="english"
                            value={editingKeyword.english}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded resize-y text-center"
                            required
                          />
                        </td>
                        <td className="p-3 border-b border-r border-gray-200">
                          <select
                            name="original_language"
                            className="w-full p-2 border-2 border-gray-300 rounded text-center"
                            disabled
                          >
                            <option value="Japanese">Japnese</option>
                          </select>
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <select
                            name="target_language"
                            className="w-full p-2 border-2 border-gray-300 rounded text-center"
                            disabled
                          >
                            <option value="English">English</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded ml-2"
                  onClick={() => setEditingKeyword(null)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {isAddingKeyword && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            onClick={() => setIsAddingKeyword(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-11/12 max-h-[90vh] overflow-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg text-[#004098CC] font-bold mb-4">ADD NEW PRIVATE KEYWORD</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddKeyword();
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[#004098CC] text-white">
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Original Word</th>
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Target Word</th>
                        <th className="p-3 border-b border-r border-gray-300 w-1/4 text-center">Original Language</th>
                        <th className="p-3 border-b border-gray-300 w-1/4 text-center">Target Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border-b border-r border-gray-200">
                          <textarea
                            name="original_word"
                            value={newKeyword.original_word}
                            onChange={(e) =>
                              setNewKeyword({
                                ...newKeyword,
                                original_word: e.target.value,
                              })
                            }
                            className="w-full p-2 border-2 border-gray-300 rounded resize-y text-center"
                            required
                          />
                        </td>
                        <td className="p-3 border-b border-r border-gray-200">
                          <textarea
                            name="target_word"
                            value={newKeyword.target_word}
                            onChange={(e) =>
                              setNewKeyword({
                                ...newKeyword,
                                target_word: e.target.value,
                              })
                            }
                            className="w-full p-2 border-2 border-gray-300 rounded resize-y text-center"
                            required
                          />
                        </td>
                        <td className="p-3 border-b border-r border-gray-200">
                          <select
                            name="original_language"
                            value={newKeyword.original_language}
                            onChange={(e) =>
                              setNewKeyword({
                                ...newKeyword,
                                original_language: e.target.value,
                              })
                            }
                            className={`w-full p-2 border-2 ${
                              newKeyword.original_language === newKeyword.target_language
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded text-center`}
                            required
                          >
                            <option value="Japanese">Japanese</option>
                            <option value="English">English</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Chinese (Traditional)">Chinese (Traditional)</option>
                            <option value="Chinese (Simplified)">Chinese (Simplified)</option>
                          </select>
                          {newKeyword.original_language === newKeyword.target_language && (
                            <p className="text-red-500 text-xs mt-1">Cannot be same as target</p>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <select
                            name="target_language"
                            value={newKeyword.target_language}
                            onChange={(e) =>
                              setNewKeyword({
                                ...newKeyword,
                                target_language: e.target.value,
                              })
                            }
                            className={`w-full p-2 border-2 ${
                              newKeyword.original_language === newKeyword.target_language
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded text-center`}
                            required
                          >
                            <option value="Japanese">Japanese</option>
                            <option value="English">English</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Chinese (Traditional)">Chinese (Traditional)</option>
                            <option value="Chinese (Simplified)">Chinese (Simplified)</option>
                          </select>
                          {newKeyword.original_language === newKeyword.target_language && (
                            <p className="text-red-500 text-xs mt-1">Cannot be same as original</p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  type="submit"
                  className={`mt-4 px-4 py-2 text-white rounded ${
                    isFormValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid()}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded ml-2"
                  onClick={() => setIsAddingKeyword(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default UserLibraryManagement;
