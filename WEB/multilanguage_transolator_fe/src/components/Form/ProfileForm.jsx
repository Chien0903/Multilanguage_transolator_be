import { useState, useEffect } from "react";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
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
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setEmail(userData.email || "");
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
        first_name: firstName,
        last_name: lastName,
        email: email,
      };

      const response = await api.patch("/api/user/update-profile/", updatedData, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access"),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);
        
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
        
        {/* First Name & Last Name */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            First Name
          </label>
          <input
            className="w-1/2 p-4 border border-gray-300 rounded-lg text-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Last Name
          </label>
          <input
            className="w-1/2 p-4 border border-gray-300 rounded-lg text-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        {/* Email (Không cho chỉnh sửa) */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Email
          </label>
          <input
            className="w-3/5 p-4 border border-gray-300 rounded-lg text-lg bg-gray-100"
            value={email}
            disabled
            placeholder="Enter your email"
          />
        </div>

        {/* Role (Không cho chỉnh sửa) */}
        <div className="flex items-center mb-6">
          <label className="text-gray-600 font-semibold w-2/5 text-right pr-4 text-xl">
            Role
          </label>
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
