import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";
import Home from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";

function Logout() {
  localStorage.removeItem("access"); // Xóa JWT token
  localStorage.removeItem("refresh");
  localStorage.removeItem("full_name");
  return <Navigate to="/login" />;
}


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/userProfile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
