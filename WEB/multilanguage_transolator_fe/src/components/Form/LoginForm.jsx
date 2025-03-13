import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function LoginForm({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // Lưu lỗi email
  const [passwordError, setPasswordError] = useState(""); // Lưu lỗi mật khẩu
  const [generalError, setGeneralError] = useState(""); // Lưu thông báo lỗi chung
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError(""); // Reset lỗi chung

    try {
      const res = await api.post(route, {
        email,
        password,
      });

      if (method === "login" && res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("firstName", res.data.first_name);
        localStorage.setItem("lastName", res.data.last_name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("role", res.data.role);
        navigate("/");
      } else {
        setGeneralError("Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          setEmailError("Địa chỉ email không hợp lệ");
        }
        if (errorData.password) {
          setPasswordError("Mật khẩu không hợp lệ");
        }
        setGeneralError("Tài khoản hoặc mật khẩu không chính xác"); // Thông báo chung
      } else {
        setGeneralError("Tài khoản hoặc mật khẩu không chính xác");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-container">
      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Email address
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 border ${
            emailError || generalError ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="example@mail.toray"
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>

      <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 border ${
            passwordError || generalError ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Enter password"
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        {generalError && <p className="text-red-500 text-sm mt-1">{generalError}</p>}
      </div>

      <div className="text-right mb-4">
        <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;