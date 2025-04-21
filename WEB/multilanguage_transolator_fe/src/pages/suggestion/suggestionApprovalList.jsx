import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";

const SuggestionApprovalList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/suggestions/");
      setSuggestions(res.data.filter((item) => item.status === "reviewed"));
    } catch (err) {
      toast.error("Failed to fetch suggestions", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/suggestions/${id}/approve/`);
      toast.success("Suggestion approved and added to library!", {
        style: { backgroundColor: "green", color: "white" },
        icon: <FiCheckCircle />
      });
      fetchSuggestions();
    } catch (err) {
      toast.error("Failed to approve suggestion.", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
      return;
    }

    try {
      await api.post(`/api/suggestions/${id}/reject/`, { reason: rejectReason });
      toast.success("Suggestion rejected and sent back for revision", {
        style: { backgroundColor: "orange", color: "white" },
        icon: <FiXCircle />
      });
      setRejectingId(null);
      setRejectReason("");
      fetchSuggestions();
    } catch (err) {
      toast.error("Failed to reject suggestion", {
        style: { backgroundColor: "red", color: "white" },
        icon: <FiAlertCircle />
      });
    }
  };

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
          <h2 className="text-xl font-bold text-[#004098]">Approve Reviewed Suggestions</h2>
          <div>
            <span className="text-gray-600">
              <i>As an Admin, please approve completed keywords or reject with specific feedback</i>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-500">Loading...</div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-lg text-gray-500">No suggestions waiting for approval</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#004098CC] text-white font-bold">
                  <th className="p-3 border-b border-r border-gray-300 w-[5%]">No</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[14%]">Japanese</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[14%]">English</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[14%]">Vietnamese</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[14%]">Chinese (Traditional)</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[14%]">Chinese (Simplified)</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[5%]">Fields</th>
                  <th className="p-3 border-b border-r border-gray-300 w-[10%]">Reviewed By</th>
                  <th className="p-3 border-b border-gray-300 w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 border-b border-r border-gray-200 text-center">{index + 1}</td>
                      {["japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified"].map((lang) => (
                        <td key={lang} className="p-3 border-b border-r border-gray-200 text-center">
                          <div className="truncate max-w-[150px] mx-auto">
                            {item[lang] || "-"}
                          </div>
                        </td>
                      ))}
                      <td className="p-3 border-b border-r border-gray-200 text-center">
                        <span className={countFilledLanguages(item) >= 4 ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                          {countFilledLanguages(item)}/5
                        </span>
                      </td>
                      <td className="p-3 border-b border-r border-gray-200 text-center text-sm">
                        {item.reviewed_by || "Unknown"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <div className="flex space-x-2 justify-center">
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            onClick={() => handleApprove(item.id)}
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => setRejectingId(item.id)}
                          >
                            <FiXCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {rejectingId === item.id && (
                      <tr>
                        <td colSpan={9} className="p-3 bg-gray-100">
                          <div className="flex items-center gap-2">
                            <textarea
                              className="flex-grow p-2 border border-gray-300 rounded"
                              placeholder="Provide reason for rejection..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              rows={2}
                            />
                            <div className="flex flex-col gap-2">
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => handleReject(item.id)}
                              >
                                Reject
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
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

export default SuggestionApprovalList;
