import React, { useState, useEffect } from "react";
import { FaSearch, FaSort, FaEdit, FaTrash, FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";

const UserLibrary = () => {
  const [keywords, setKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [newKeyword, setNewKeyword] = useState({
    japanese: "",
    english: "",
    vietnamese: "",
    chinese_traditional: "",
    chinese_simplified: "",
  });
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [loading, setLoading] = useState(true);

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
      // Cập nhật danh sách bằng cách gọi lại API
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
      setKeywords(keywords.map((item) => (item.id === editingKeyword.id ? res.data : item)));
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
      !newKeyword.japanese ||
      !newKeyword.english ||
      !newKeyword.vietnamese ||
      !newKeyword.chinese_traditional ||
      !newKeyword.chinese_simplified
    ) {
      toast.error("All fields are required!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
      return;
    }

    try {
      const res = await api.post("/api/common-keyword/", {
        japanese: newKeyword.japanese,
        english: newKeyword.english,
        vietnamese: newKeyword.vietnamese,
        chinese_traditional: newKeyword.chinese_traditional,
        chinese_simplified: newKeyword.chinese_simplified,
      });
      setKeywords((prevKeywords) => [...prevKeywords, res.data]);
      setNewKeyword({
        japanese: "",
        english: "",
        vietnamese: "",
        chinese_traditional: "",
        chinese_simplified: "",
      });
      setIsAddingKeyword(false);
      toast.success("Common keyword added successfully!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiAlertCircle />,
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {}).join(", ") ||
        "Failed to add common keyword!";
      toast.error(errorMsg, {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />,
      });
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const importedKeywords = XLSX.utils.sheet_to_json(worksheet);
      console.log("Imported Keywords:", importedKeywords);
      // Chuẩn hóa dữ liệu import
      const standardizedKeywords = importedKeywords.map((keyword) => ({
        japanese: keyword.japanese || "",
        english: keyword.english || "",
        vietnamese: keyword.vietnamese || "",
        chinese_traditional: keyword.chinese_traditional || "",
        chinese_simplified: keyword.chinese_simplified || "",
      }));
      console.log("Standardized Keywords:", standardizedKeywords);
      // Gọi API để lưu dữ liệu import vào backend
      const saveImportedKeywords = async () => {
        try {
          for (const keyword of standardizedKeywords) {
            if (
              !keyword.japanese ||
              !keyword.english ||
              !keyword.vietnamese ||
              !keyword.chinese_traditional ||
              !keyword.chinese_simplified
            ) {
              toast.error("Imported data is missing required fields!", {
                style: { backgroundColor: "red", color: "white" },
                icon: <FiAlertCircle />,
              });
              return;
            }
            await api.post("/api/common-keyword/", {
              japanese: keyword.japanese,
              english: keyword.english,
              vietnamese: keyword.vietnamese,
              chinese_traditional: keyword.chinese_traditional,
              chinese_simplified: keyword.chinese_simplified,
            });
          }
          toast.success("Keywords imported successfully!", {
            style: { backgroundColor: "green", color: "white" },
            icon: <FiAlertCircle />,
          });
          // Cập nhật danh sách từ API
          const res = await api.get("/api/common-keyword/");
          setKeywords(res.data);
        } catch (error) {
          const errorMsg =
            error.response?.data?.detail ||
            Object.values(error.response?.data || {}).join(", ") ||
            "Failed to save imported keywords!";
          toast.error(errorMsg, {
            style: { backgroundColor: "red", color: "white" },
            icon: <FiAlertCircle />,
          });
        }
      };
      saveImportedKeywords();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const exportData = keywords.map((keyword) => ({
      japanese: keyword.japanese || "",
      english: keyword.english || "",
      vietnamese: keyword.vietnamese || "",
      chinese_tr: keyword.chinese_traditional || "",
      chinese_simplified: keyword.chinese_simplified || "",
      date_modified: keyword.date_modified || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Keywords");
    XLSX.writeFile(workbook, "keywords.xlsx");
  };

  const filteredKeywords = keywords
    .filter((item) => {
      const japanese = item.japanese || "";
      const english = item.english || "";
      const vietnamese = item.vietnamese || "";
      const chineseTraditional = item.chinese_traditional || "";
      const chineseSimplified = item.chinese_simplified || "";

      return (
        japanese.includes(searchTerm) ||
        english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chineseTraditional.includes(searchTerm) ||
        chineseSimplified.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const dateA = a.date_modified || new Date().toISOString().split("T")[0];
      const dateB = b.date_modified || new Date().toISOString().split("T")[0];
      return sortOrder === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-4 text-[#004098CC] text-center">
        Common Library Management
      </h2>

      <div className="bg-[#004098CC] p-3 rounded mb-4 flex flex-wrap items-center text-white gap-4">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center px-4 py-2 rounded text-white bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsAddingKeyword(true)}
          >
            <FaPlus className="mr-2" /> Add Common Keyword
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleExport}
          >
            <FaFileExport className="mr-2" /> Export Keywords
          </button>
          <label className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
            <FaFileImport className="mr-2" /> Import Keywords
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} />
          </label>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-white" />
            <input
              type="text"
              placeholder="Search key-word..."
              className="p-2 pl-10 border rounded w-full bg-[#004098CC] text-white placeholder-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-64">
            <FaSort className="absolute left-3 top-3 text-white" />
            <select
              className="p-2 pl-10 border rounded w-full bg-[#004098CC] text-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Sort by Date (Asc)</option>
              <option value="desc">Sort by Date (Desc)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center shadow-lg">
          <thead>
            <tr className="bg-white text-black font-bold border-b">
              <th className="p-3 border w-[5%]">No</th>
              <th className="p-3 border w-[15%]">Japanese</th>
              <th className="p-3 border w-[15%]">English</th>
              <th className="p-3 border w-[15%]">Vietnamese</th>
              <th className="p-3 border w-[15%]">Chinese (Traditional)</th>
              <th className="p-3 border w-[15%]">Chinese (Simplified)</th>
              <th className="p-3 border w-[10%]">Date Modified</th>
              <th className="p-3 border w-[10%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className="border hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedKeyword(item)}
              >
                <td className="p-3 border">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className="p-3 border truncate max-w-[100px]">{item.japanese}</td>
                <td className="p-3 border truncate max-w-[100px]">{item.english}</td>
                <td className="p-3 border truncate max-w-[100px]">{item.vietnamese}</td>
                <td className="p-3 border truncate max-w-[100px]">{item.chinese_traditional}</td>
                <td className="p-3 border truncate max-w-[100px]">{item.chinese_simplified}</td>
                <td className="p-3 border">{item.date_modified}</td>
                <td className="p-3 border">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2 text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 text-xl"
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

      <div className="flex justify-center mt-4">
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
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setSelectedKeyword(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-auto max-w-4xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">COMMON KEYWORD DETAILS</h3>
            <table className="border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border w-1/6">Japanese</th>
                  <th className="p-3 border w-1/6">English</th>
                  <th className="p-3 border w-1/6">Vietnamese</th>
                  <th className="p-3 border w-1/6">Chinese (Traditional)</th>
                  <th className="p-3 border w-1/6">Chinese (Simplified)</th>
                  <th className="p-3 border w-1/6">Date Modified</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border whitespace-normal break-words">
                    {selectedKeyword.japanese}
                  </td>
                  <td className="p-3 border whitespace-normal break-words">
                    {selectedKeyword.english}
                  </td>
                  <td className="p-3 border whitespace-normal break-words">
                    {selectedKeyword.vietnamese}
                  </td>
                  <td className="p-3 border whitespace-normal break-words">
                    {selectedKeyword.chinese_traditional}
                  </td>
                  <td className="p-3 border whitespace-normal break-words">
                    {selectedKeyword.chinese_simplified}
                  </td>
                  <td className="p-3 border">{selectedKeyword.date_modified}</td>
                </tr>
              </tbody>
            </table>
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
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setEditingKeyword(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-auto max-w-4xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">EDIT COMMON KEYWORD</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <table className="border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border w-1/6">Japanese</th>
                    <th className="p-3 border w-1/6">English</th>
                    <th className="p-3 border w-1/6">Vietnamese</th>
                    <th className="p-3 border w-1/6">Chinese (Traditional)</th>
                    <th className="p-3 border w-1/6">Chinese (Simplified)</th>
                    <th className="p-3 border w-1/6">Date Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">
                      <textarea
                        name="japanese"
                        value={editingKeyword.japanese}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="english"
                        value={editingKeyword.english}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="vietnamese"
                        value={editingKeyword.vietnamese}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="chinese_traditional"
                        value={editingKeyword.chinese_traditional}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="chinese_simplified"
                        value={editingKeyword.chinese_simplified}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="date_modified"
                        value={editingKeyword.date_modified}
                        onChange={handleChange}
                        className="w-full p-2 border rounded resize-y"
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsAddingKeyword(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-auto max-w-4xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">ADD NEW COMMON KEYWORD</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddKeyword(); }}>
              <table className="border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border w-1/5">Japanese</th>
                    <th className="p-3 border w-1/5">English</th>
                    <th className="p-3 border w-1/5">Vietnamese</th>
                    <th className="p-3 border w-1/5">Chinese (Traditional)</th>
                    <th className="p-3 border w-1/5">Chinese (Simplified)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">
                      <textarea
                        name="japanese"
                        value={newKeyword.japanese}
                        onChange={(e) =>
                          setNewKeyword({ ...newKeyword, japanese: e.target.value })
                        }
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="english"
                        value={newKeyword.english}
                        onChange={(e) =>
                          setNewKeyword({ ...newKeyword, english: e.target.value })
                        }
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="vietnamese"
                        value={newKeyword.vietnamese}
                        onChange={(e) =>
                          setNewKeyword({ ...newKeyword, vietnamese: e.target.value })
                        }
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="chinese_traditional"
                        value={newKeyword.chinese_traditional}
                        onChange={(e) =>
                          setNewKeyword({
                            ...newKeyword,
                            chinese_traditional: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                    <td className="p-3 border">
                      <textarea
                        name="chinese_simplified"
                        value={newKeyword.chinese_simplified}
                        onChange={(e) =>
                          setNewKeyword({
                            ...newKeyword,
                            chinese_simplified: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded resize-y"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
  );
};

export default UserLibrary;