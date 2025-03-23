import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants/constants";

function LoginForm({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

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
        setGeneralError("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          setEmailError("Invalid email address");
        }
        if (errorData.password) {
          setPasswordError("Invalid password");
        }
        setGeneralError("Invalid email or password");
      } else {
        setGeneralError("Invalid email or password");
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
          className={`w-full px-4 py-3 border ${
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
          className={`w-full px-4 py-3 border ${
            passwordError || generalError ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Enter password"
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        {generalError && <p className="text-red-500 text-sm mt-1">{generalError}</p>}
      </div>

      <div className="text-right mb-5">
        <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md font-medium flex justify-center items-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

export default LoginForm;