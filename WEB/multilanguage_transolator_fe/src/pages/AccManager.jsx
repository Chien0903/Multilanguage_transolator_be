import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../components/Header/Header";
import Sidebar from "../components/Home/SideBar";
import axios from "axios";

const AccountManagement = () => {
  // State chứa danh sách tất cả tài khoản lấy từ API
  const [user, setUser] = useState([]);
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Gọi API để lấy dữ liệu từ database khi component mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/") 
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const totalPages = Math.ceil(user.length / itemsPerPage);

  const currentAccounts = user.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (id) => {
    alert(`Edit account ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      alert(`Deleted account ID: ${id}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header title="ADMINISTRATOR" />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Account Management</h2>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Account</h3>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAccounts.map((account, index) => (
                  <tr key={account.id} className="border-t">
                    <td className="p-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">{account.full_name}</td>
                    <td className="p-3">{account.role}</td>
                    <td className="p-3">{account.email}</td>
                    <td className="p-3 flex justify-center space-x-3">
                      <button
                        className="flex items-center text-blue-500 hover:text-blue-700 space-x-1"
                        onClick={() => handleEdit(account.id)}
                      >
                        <FaEdit size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center text-red-500 hover:text-red-700 space-x-1"
                        onClick={() => handleDelete(account.id)}
                      >
                        <FaTrash size={18} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-start mt-4 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
