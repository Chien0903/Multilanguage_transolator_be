import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const SuggestionReviewList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/api/common-keyword/suggestions/");
      const filtered = res.data.filter((sug) => sug.status === "pending");
      setSuggestions(filtered);
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu từ server");
    }
  };

  const handleStartEdit = (sug) => {
    setEditingId(sug.id);
    setEditedData({ ...sug }); // copy dữ liệu hiện tại
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReview = async () => {
    try {
      await api.put(`/api/suggestions/${editingId}/review/`, editedData);
      toast.success("Đã duyệt thành công!");
      setEditingId(null);
      fetchSuggestions();
    } catch (err) {
      toast.error("Lỗi khi duyệt!");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-6 text-[#004098]">Pending Suggestions</h2>
      <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden bg-white text-center">
        <thead className="bg-[#004098CC] text-white">
          <tr>
            <th className="p-3 border">No</th>
            <th className="p-3 border">Japanese</th>
            <th className="p-3 border">English</th>
            <th className="p-3 border">Vietnamese</th>
            <th className="p-3 border">Chinese (Traditional)</th>
            <th className="p-3 border">Chinese (Simplified)</th>
            <th className="p-3 border">Date Created</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {suggestions.map((sug, index) => (
            <tr key={sug.id} className="hover:bg-gray-50">
              <td className="border p-2">{index + 1}</td>

              {["japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified"].map((field) => (
                <td key={field} className="border p-2">
                  {editingId === sug.id ? (
                    <textarea
                      value={editedData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                      rows={2}
                    />
                  ) : (
                    sug[field] || "-"
                  )}
                </td>
              ))}

              <td className="border p-2">{dayjs(sug.created_at).format("MM/DD/YY")}</td>

              <td className="border p-2">
                {editingId === sug.id ? (
                  <button
                    onClick={handleSubmitReview}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    ✅ Submit
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(sug)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    ✏️ Duyệt
                  </button>
                )}
              </td>
            </tr>
          ))}
          {suggestions.length === 0 && (
            <tr>
              <td colSpan={8} className="p-4 text-gray-500 italic">
                Không có từ nào đang chờ duyệt.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuggestionReviewList;
