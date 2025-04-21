import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const SuggestionReviewList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/common-keyword/suggestions/");
      const filtered = res.data.filter((sug) => sug.status === "pending");
      setSuggestions(filtered);
    } catch (err) {
      toast.error("Failed to fetch suggestions from server", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (sug) => {
    setEditingId(sug.id);
    setEditedData({ ...sug });
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReview = async () => {
    const filledLanguages = Object.entries(editedData)
      .filter(([key, value]) => 
        ['japanese', 'english', 'vietnamese', 'chinese_traditional', 'chinese_simplified'].includes(key) && 
        value && value.trim() !== ''
      );
      
    if (filledLanguages.length < 2) {
      toast.error("Please complete at least two language fields", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
      return;
    }

    try {
      // Update the status to "reviewed" so it appears in the approval list
      const reviewData = { 
        ...editedData, 
        status: "reviewed",
        reviewed_by: localStorage.getItem('username') || 'Keeper',
        reviewed_at: new Date().toISOString()
      };
      
      await api.put(`/api/suggestions/${editingId}/review/`, editedData);
      toast.success("Successfully submitted for approval!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiCheckCircle />
      });
      setEditingId(null);
      fetchSuggestions();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review!", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
    }
  };

  // Function to check if all languages are filled
  const areAllLanguagesFilled = (data) => {
    return ['japanese', 'english', 'vietnamese', 'chinese_traditional', 'chinese_simplified']
      .every(lang => data[lang] && data[lang].trim() !== '');
  }

  // Count filled languages
  const countFilledLanguages = (data) => {
    return ['japanese', 'english', 'vietnamese', 'chinese_traditional', 'chinese_simplified']
      .filter(lang => data[lang] && data[lang].trim() !== '')
      .length;
  }

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#004098]">Review Pending Suggestions</h2>
          <div>
            <span className="text-gray-600">
              <i>As a Keeper, please review, complete or fix translations before submitting for approval</i>
            </span>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#004098CC] text-white font-bold">
                <th className="p-3 border-b border-r border-gray-300 w-[5%] text-center">No</th>
                <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Japanese</th>
                <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">English</th>
                <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Vietnamese</th>
                <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Chinese (Traditional)</th>
                <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Chinese (Simplified)</th>
                <th className="p-3 border-b border-r border-gray-300 w-[10%] text-center">Created By</th>
                <th className="p-3 border-b border-gray-300 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">Loading...</td>
                </tr>
              ) : suggestions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500 italic">
                    No pending suggestions found.
                  </td>
                </tr>
              ) : (
                suggestions.map((sug, index) => (
                  <tr key={sug.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border-b border-r border-gray-200 text-center">
                      {index + 1}
                    </td>
                    {["japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified"].map((field) => (
                      <td key={field} className="p-3 border-b border-r border-gray-200 text-center">
                        {editingId === sug.id ? (
                          <textarea
                            value={editedData[field] || ""}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="w-full border-2 border-gray-300 rounded p-2 text-sm resize-y"
                            rows={3}
                          />
                        ) : (
                          <div className="truncate max-w-[150px] mx-auto">
                            {sug[field] || "-"}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="p-3 border-b border-r border-gray-200 text-center text-sm">
                      {sug.created_by || "Anonymous"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center">
                      {editingId === sug.id ? (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={handleSubmitReview}
                            className={`px-3 py-1 rounded hover:bg-blue-600 text-sm ${
                              countFilledLanguages(editedData) >= 2 ? 'bg-[#2F80ED] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={countFilledLanguages(editedData) < 2}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(sug)}
                          className="px-3 py-1 bg-[#2F80ED] text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
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

export default SuggestionReviewList;
