import React, { useState } from "react";

const ProfileForm = () => {
  const [fullName, setFullName] = useState(() => localStorage.getItem("full_name") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [role] = useState(() => localStorage.getItem("role") || "");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="text-left mb-6 w-full">
        <h2 className="text-3xl font-semibold">My profile</h2>
        <p className="text-gray-500 text-base">Manage profile information</p>
      </div>
      <hr className="border-gray-300 mb-6 w-full" />
      <div className="w-full">
        {/* Name */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Name</label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Email</label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Phone Number */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Phone number</label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Role */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Role</label>
          <p className="w-3/5 text-black font-semibold text-lg">{role}</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-4 rounded-lg w-auto font-medium text-lg" onClick={handleSave}>
            Save change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;