import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const SuggestionApprovalList = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const res = await api.get("/api/suggestions/");
    setSuggestions(res.data.filter((item) => item.status === "reviewed"));
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/suggestions/${id}/approve/`);
      toast.success("Suggestion approved and added to library!");
      fetchSuggestions();
    } catch (err) {
      toast.error("Failed to approve suggestion.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-[#004098]">Approve Reviewed Suggestions</h2>
      {suggestions.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded shadow mb-6">
          <ul className="space-y-1">
            {["japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified"].map((lang) => (
              <li key={lang}>
                <strong>{lang.replace("_", " ")}:</strong> {item[lang] || <em>(empty)</em>}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            onClick={() => handleApprove(item.id)}
          >
            Approve to Library
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestionApprovalList;
