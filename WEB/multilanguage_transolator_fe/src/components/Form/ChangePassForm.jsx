import React, { useState } from "react";
import axios from "axios";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Thêm state cho thông báo thành công

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra mật khẩu mới và xác nhận phải khớp nhau
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      const res = await axios.patch("/api/change-password", data, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (res.status === 200) {
        setSuccess(res.data.detail);
        // Reset lại form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="text-left mb-6 w-full">
        <h2 className="text-3xl font-semibold">Change Password</h2>
        <p className="text-gray-500 text-base">
          Please fill out the form to change your password
        </p>
      </div>
      <hr className="border-gray-300 mb-6 w-full" />
      <div className="w-full">
        {/* Current Password */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Current Password
          </label>
          <input
            type="password"
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        {/* New Password */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            New Password
          </label>
          <input
            type="password"
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm New Password */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center text-lg mb-6">{error}</p>
        )}
        
        {/* Success Message */}
        {success && (
          <p className="text-green-500 text-center text-lg mb-6">{success}</p>
        )}

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-4 rounded-lg w-auto font-medium text-lg"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
