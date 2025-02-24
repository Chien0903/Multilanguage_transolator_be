import { useState, useEffect } from "react";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/profile/", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          },
        });
        console.log(response.data);
        const userData = response.data;
        setFullName(userData.full_name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setRole(userData.role || "User");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedData = {
        full_name: fullName,
        email: email,
        phone: phone,
      };

      const response = await api.patch("/api/user/update-profile/", updatedData, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("full_name", fullName);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
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

        {/* Email (Không cho chỉnh sửa) */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Email</label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg bg-gray-100"
            value={email}
            disabled
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

        {/* Role (Không cho chỉnh sửa) */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">Role</label>
          <p className="w-3/5 text-black font-semibold text-lg">{role}</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button 
            className="bg-blue-600 text-white px-6 py-4 rounded-lg w-auto font-medium text-lg" 
            onClick={handleSave}
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

export default ProfileForm;
