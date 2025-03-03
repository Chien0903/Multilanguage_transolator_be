import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import api from "../api";
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
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6">Account Management</h2>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>

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

        {/* Phân trang */}
        <div className="flex justify-start mt-4 space-x-2 ">
          {currentPage > 1 && (
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
          )}

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
