import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import axios from "axios";

function RegisterForm({ route, method }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Hàm kiểm tra email phải kết thúc bằng @gmail.com
  const validateEmail = (email) => {
    const regex = /^[\w.-]+@gmail\.com$/;
    return regex.test(email);
  };

  // Hàm handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateEmail(email)) {
      alert("Vui lòng nhập email");
      setLoading(false);
      return;
    } 
    // Kiểm tra password khớp
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const data = {
        email: email,
        full_name: fullName,
        password: password,
        confirm_password: confirmPassword,
      };

      const res = await axios.post(route, data, {
        headers: { "Content-Type": "application/json" },
      });      
      
      // Kiểm tra xem server trả về gì
      if (res.status === 201 || res.status === 200) {
        // Nếu muốn lưu token sau khi đăng ký (nếu server trả token khi đăng ký)
        if (res.data.access && res.data.refresh) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        }
        // Chuyển hướng sang trang login hoặc trang chủ tuỳ ý
        navigate("/login");
        alert("Registration successful!");
      } else {
        // Trường hợp khác
        alert("Registration failed!");
      }
    } catch (error) {
      console.log(error);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Email address
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          FullName
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Confirm password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Loading..." : "Sign up"}
      </button>
    </form>
  );
}

export default RegisterForm;
