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
      style: { backgroundColor: "red", color: "white" },
      icon: <FiAlertCircle />,
    });

  const notifySuccess = () =>
    toast.success("Đăng ký thành công!", {
      style: { backgroundColor: "green", color: "white" },
      icon: <FiAlertCircle />,
    });

  const validateEmail = (email) => /^[\w.-]+@gmail\.com$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      notifyError("Vui lòng nhập email hợp lệ!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      notifyError("Mật khẩu xác nhận không khớp!");
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
      notifyError("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email address</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter email address"
          required
        />
      </div>

      {/* First Name & Last Name in one row */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter first name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Confirm password"
          required
        />
      </div>

      <ToastContainer />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Loading..." : "Sign up"}
      </button>
    </form>
  );
}

export default RegisterForm;
