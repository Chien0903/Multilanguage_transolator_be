import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/User/login/LoginPage";
import RegisterPage from "./pages/User/login/registerPage";
import HomePage from "./pages/User/home/HomePage"; 
import NotFound from "./pages/NotFound"; 
import ProtectedRoute from "./components/ProtectedRoute";
import MyProfile from "./pages/User/profile/MyProfile";
import AccountManagement from "./pages/Admin/AccountManagement"; 
import ChangePassword from "./pages/User/profile/ChangePassword";
import EditUserRole from "./pages/Admin/EditUserRole"; 
import Layout from "./components/Layouts/layout";
import CommonLibraryManagement from './pages/Admin/CommonLibraryManagement';
import PrivateLibraryManagement from './pages/User/home/PrivateLibraryManagement';

function Logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin/edit-user/:id" element={<EditUserRole />} />
          <Route path="/admin" element={<AccountManagement />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/common-library" element={<CommonLibraryManagement />} />
          <Route path="/private-library" element={<PrivateLibraryManagement />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
