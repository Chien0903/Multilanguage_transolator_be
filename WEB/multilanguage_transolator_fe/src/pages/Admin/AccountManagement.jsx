import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import api from "../../api";

import { toast } from "react-toastify";

function AccountManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterRole, setFilterRole] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "Admin") {
      toast.error("Bạn không có quyền truy cập!");
      navigate("/"); 
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/user/");
      const usersWithFullName = response.data.map(user => ({
        ...user,
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim()
      }));
      setUser(usersWithFullName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

    try {
      await api.delete(`/api/user/${id}/delete/`);
      toast.success("Tài khoản đã bị xóa!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa tài khoản.");
    }
  };

  const filteredUsers = user.filter(account => {
    return (
      account.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "" || account.role === filterRole)
    );
  });
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentAccounts = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 p-6 flex flex-col h-screen overflow-hidden">
      
      <div className="bg-[#004098CC] p-3 rounded flex flex-wrap items-center text-white gap-4">
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-black z-10" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border rounded w-full bg-white text-black placeholder-gray-400"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded bg-white text-black"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full border border-gray-400 rounded-smsm overflow-hidden text-center">
          <thead>
            <tr className="bg-white text-black font-bold border-b-2 border-gray-400">
              <th className="p-3 border-2 border-gray-300 w-[5%]">#</th>
              <th className="p-3 border-2 border-gray-300 w-[25%]">Name</th>
              <th className="p-3 border-2 border-gray-300 w-[15%]">Role</th>
              <th className="p-3 border-2 border-gray-300 w-[35%]">Email</th>
              <th className="p-3 border-2 border-gray-300 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr key={account.id} className="border-2 border-gray-300 hover:bg-gray-100">
                <td className="p-3 border-2 border-gray-300">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-3 border-2 border-gray-300">{account.full_name}</td>
                <td className="p-3 border-2 border-gray-300">{account.role}</td>
                <td className="p-3 border-2 border-gray-300">{account.email}</td>
                <td className="p-3  border-gray-300 flex justify-center space-x-3">
                  <Link
                    to={`/admin/edit-user/${account.id}`}
                    className="flex items-center text-blue-500 hover:text-blue-700 space-x-1 cursor-pointer"
                  >
                    <FaEdit size={18} />
                    <span>Edit Role</span>
                  </Link>

                  <button
                    className="flex items-center text-red-500 hover:text-red-700 space-x-1 cursor-pointer"
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
      </div>

      {/* Pagination controls - positioned at bottom */}
      <div className="flex justify-center py-4 mt-auto">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="mx-4 self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AccountManagement;
