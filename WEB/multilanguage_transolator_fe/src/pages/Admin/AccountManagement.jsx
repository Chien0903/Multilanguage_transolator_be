import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function AccountManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });
  

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
      const usersWithFullName = response.data.map((user) => ({
        ...user,
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
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

  const handleAddAccount = async (e) => {
    e.preventDefault();

    if (
      !newAccount.firstName ||
      !newAccount.lastName ||
      !newAccount.email ||
      !newAccount.password
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (newAccount.password !== newAccount.confirmPassword) {
      toast.error("Password and confirm password do not match!");
      return;
    }
    
    try {
      await api.post("/api/user/register/", {
        first_name: newAccount.firstName,
        last_name: newAccount.lastName,
        email: newAccount.email,
        password: newAccount.password,
        role: newAccount.role,
      });

      try {
        await api.post("/api/user/send-account-info/", {
          email: newAccount.email,
          first_name: newAccount.firstName,
          last_name: newAccount.lastName,
          password: newAccount.password,
        });
        toast.success("Account created and email sent successfully!");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        toast.warning("Account created but failed to send email notification.");
      }

      fetchUsers();
      setIsAddingAccount(false);
      setNewAccount({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {}).join(", ") ||
        "Failed to create account!";
      toast.error(errorMsg);
    }
  };

  // Sort and filter
  const sortedUsers = [...user].sort((a, b) => {
    const aVal = a[sortField]?.toString().toLowerCase();
    const bVal = b[sortField]?.toString().toLowerCase();
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((account) => {
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button
          className="flex items-center rounded-full px-4 py-2 text-white bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsAddingAccount(true)}
        >
          <FaPlus className="mr-2" /> Create Account
        </button>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-black z-10" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border rounded-full w-full bg-white text-black placeholder-gray-400"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded-full bg-white text-black"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Library Keeper">Library Keeper</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="p-2 border rounded-full bg-white text-black"
          >
            <option value="id">Sort by ID</option>
            <option value="full_name">Sort by Name</option>
            <option value="role">Sort by Role</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-full bg-white text-black"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#004098CC] text-white font-bold">
              <th className="p-3 border-b border-r border-gray-300 text-center">#</th>
              <th className="p-3 border-b border-r border-gray-300 text-center">Name</th>
              <th className="p-3 border-b border-r border-gray-300 text-center">Role</th>
              <th className="p-3 border-b border-r border-gray-300 text-center">Email</th>
              <th className="p-3 border-b border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr key={account.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="p-3 border-b border-r border-gray-200 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-3 border-b border-r border-gray-200 text-center">{account.full_name}</td>
                <td className="p-3 border-b border-r border-gray-200 text-center">{account.role}</td>
                <td className="p-3 border-b border-r border-gray-200 text-center">{account.email}</td>
                <td className="p-3 border-b border-gray-200 text-center flex justify-center space-x-3">
                  <Link
                    to={`/admin/edit-user/${account.id}`}
                    className="flex items-center text-blue-500 hover:text-blue-700 space-x-1"
                  >
                    <FaEdit size={18} />
                    <span>Edit Role</span>
                  </Link>
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
      </div>

      {/* Modal Tạo tài khoản – giữ nguyên của bạn */}
      {isAddingAccount && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          onClick={() => setIsAddingAccount(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
            style={{ border: "2px solid #ccc" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create New Account</h3>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the details to create a new user account
              </p>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={newAccount.firstName}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newAccount.lastName}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={newAccount.confirmPassword}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Account Role</label>
                <select
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Library Keeper">Library Keeper</option>
                </select>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setIsAddingAccount(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center py-4 mt-auto">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-4 self-center">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AccountManagement;
