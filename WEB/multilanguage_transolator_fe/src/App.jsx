import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AccountManagement from "./pages/AccManager";
import ChangePassword from "./pages/ChangePassword";
import EditUserRole from "./pages/EditUserRole";
import Layout from "./components/Layouts/layout";

function Logout() {
  localStorage.removeItem("access"); // Xóa JWT token
  localStorage.removeItem("refresh");
  localStorage.removeItem("full_name");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  return <Navigate to="/login" />;
}


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/userProfile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/admin/edit-user/:id" element={<EditUserRole />} />
            <Route path="/admin" element={<AccountManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
