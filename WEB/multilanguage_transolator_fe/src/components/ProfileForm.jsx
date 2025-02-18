import React, { useState } from "react";

const ProfileForm = () => {
  const [fullName, setFullName] = useState(() => localStorage.getItem("full_name") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [role] = useState(() => localStorage.getItem("role") || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match!");
      return;
    }

    setError("");
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
        {/* Name */}
        <label className="block mb-2">Name</label>
        <input className="w-full p-2 border rounded mb-4" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        {/* Email */}
        <label className="block mb-2">Email</label>
        <input className="w-full p-2 border rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />

        {/* Role */}
        <label className="block mb-2">Role</label>
        <input className="w-full p-2 border rounded mb-4" value={role} disabled />

        {/* Change Password Section */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Change Password</h3>

        {/* Current Password */}
        <label className="block mb-2">Current Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* New Password */}
        <label className="block mb-2">New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <label className="block mb-2">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Save Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;