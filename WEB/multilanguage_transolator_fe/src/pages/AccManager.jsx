import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import api from "../api";
import { toast } from "react-toastify";

function AccountManagement() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "Admin") {
      toast.error("Bạn không có quyền truy cập!");
      navigate("/"); 
    }
  }, [navigate]);

  const [user, setUser] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    api.get("/api/user/")
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      alert(`Deleted account ID: ${id}`);
    }
  };
  function getVisiblePages(current, total) {
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    let pages = [current];
    if (current > 1) {
      pages.unshift(current - 1);
    }
    if (current < total) {
      pages.push(current + 1);
    }

    return pages;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div>
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

          <div className="flex justify-start mt-4 space-x-2 ">

            {currentPage > 1 && (
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
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
    </div>
  );
}

export default AccountManagement;
