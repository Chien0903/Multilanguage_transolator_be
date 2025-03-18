import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { ToastContainer, toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";
import api from "../../api";

function RegisterForm({ route }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notifyError = (msg) =>
    toast.error(msg, {
      style: { backgroundColor: "#f44336", color: "white" },
      icon: <FiAlertCircle />,
    });

  const notifySuccess = () =>
    toast.success("Registration successful!", {
      style: { backgroundColor: "#4caf50", color: "white" },
      icon: <FiAlertCircle />,
    });

  const validateEmail = (email) => /^[\w.-]+@mail\.toray$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      notifyError("Email must have the format @mail.toray!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      notifyError("Password confirmation doesn't match!");
      setLoading(false);
      return;
    }

    try {
      const data = {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        confirm_password: confirmPassword,
      };

      const res = await api.post(route, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201 || res.status === 200) {
        if (res.data.access && res.data.refresh) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        }
        notifySuccess();
        navigate("/login");
      } else {
        notifyError("Registration failed!");
      }
    } catch (error) {
      console.error(error);
      notifyError(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Email address</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="example@mail.toray"
          required
        />
      </div>

      {/* First Name & Last Name in one row */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter first name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Confirm password"
          required
        />
      </div>

      <ToastContainer />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md flex justify-center items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </>
        ) : (
          "Sign up"
        )}
      </button>
    </form>
  );
}

export default RegisterForm;
