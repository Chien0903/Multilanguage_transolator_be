import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditUserRole = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get(`/api/user/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setRole(response.data.role);
      } catch (error) {
        console.error(" Lỗi khi lấy thông tin user:", error);
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      await api.patch(
        `/api/user/${id}/update-role/`,
        { role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success("Cập nhật thành công!");

      const currentUserEmail = localStorage.getItem("email");
      if (email === currentUserEmail) {
        localStorage.setItem("role", role);
        window.dispatchEvent(new Event("storage"));
      }

      setTimeout(() => navigate("/admin/"), 2000);
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
      toast.error("Không thể cập nhật vai trò.");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <p className="text-center text-blue-600">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="text-left mb-6 w-full">
        <h2 className="text-3xl font-semibold">Edit User Role</h2>
        <p className="text-gray-500 text-base">Manage user role information</p>
      </div>
      <hr className="border-gray-300 mb-6 w-full" />

      <div className="w-full">
        {/* First Name & Last Name */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            First Name
          </label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg bg-gray-100"
            value={firstName}
            disabled
          />
        </div>

        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Last Name
          </label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg bg-gray-100"
            value={lastName}
            disabled
          />
        </div>

        {/* Email */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Email
          </label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg bg-gray-100"
            value={email}
            disabled
          />
        </div>

        {/* Role Selection */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Role
          </label>
          <div className="w-3/5 flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="User"
                checked={role === "User"}
                onChange={() => setRole("User")}
              />
              <span>User</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === "Admin"}
                onChange={() => setRole("Admin")}
              />
              <span>Admin</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-4 rounded-lg w-auto font-medium text-lg"
            onClick={handleUpdateRole}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditUserRole;
