import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaCheck, FaTrash } from "react-icons/fa";

const KeywordUpdate = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(''); // 'single' or 'all'
  const [confirmingNotification, setConfirmingNotification] = useState(null);

  // Enhanced notification data with all language fields
  const notifications = [
    { 
      id: 1, 
      japanese: "安全", 
      english: "Safety", 
      vietnamese: "An toàn", 
      chinese_traditional: "安全", 
      chinese_simplified: "安全", 
      date_modified: "2023-10-15" 
    },
    { 
      id: 2, 
      japanese: "品質", 
      english: "Quality", 
      vietnamese: "Chất lượng", 
      chinese_traditional: "品質", 
      chinese_simplified: "品质", 
      date_modified: "2023-10-14" 
    },
    { 
      id: 3, 
      japanese: "生産", 
      english: "Production", 
      vietnamese: "Sản xuất", 
      chinese_traditional: "生產", 
      chinese_simplified: "生产", 
      date_modified: "2023-10-12" 
    },
    { 
      id: 4, 
      japanese: "メンテナンス", 
      english: "Maintenance", 
      vietnamese: "Bảo trì", 
      chinese_traditional: "維護", 
      chinese_simplified: "维护", 
      date_modified: "2023-10-10" 
    }
  ];

  // Function to handle notification update
  const handleUpdateNotification = (notification) => {
    setEditingNotification({ ...notification });
    // In a real app, this would save to backend
    console.log("Updating notification:", notification);
  };

  // Function to handle notification deletion
  const handleDeleteNotification = (id) => {
    // In a real app, this would delete from backend
    console.log("Deleting notification with ID:", id);
  };

  // Function to handle confirmation response
  const handleConfirmUpdate = () => {
    if (confirmationType === 'single' && confirmingNotification) {
      console.log("Confirmed accepting notification:", confirmingNotification);
      // In a real app, this would mark the notification as accepted in the backend and add to private library
    } else if (confirmationType === 'all') {
      console.log("Confirmed updating all notifications");
      // In a real app, this would update all notifications in backend and add to private library
    }
    setShowConfirmation(false);
  };

  // Function to handle updating all notifications
  const handleUpdateAll = () => {
    setConfirmationType('all');
    setShowConfirmation(true);
  };

  // Function to handle accepting a notification
  const handleAcceptNotification = (notification) => {
    setConfirmingNotification(notification);
    setConfirmationType('single');
    setShowConfirmation(true);
  };

  return (
    <div className="relative ml-4">
      <div 
        className="relative cursor-pointer"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <IoNotificationsOutline size={24} className="text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {notifications.length}
        </span>
      </div>
      
      {/* Enhanced Notification Popup with white border and alternating row colors */}
      {showNotifications && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-50" 
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          onClick={() => setShowNotifications(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-6xl w-11/12 max-h-[90vh] overflow-auto text-center border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg text-[#004098CC] font-bold mb-4">KEYWORD UPDATES</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden border-4 border-white">
                <thead>
                  <tr className="bg-[#004098CC] text-white font-bold">
                    <th className="p-3 border-b border-r border-gray-300 w-[5%] text-center">No</th>
                    <th className="p-3 border-b border-r border-gray-300 w-[20%] text-center">Original Word</th>
                    <th className="p-3 border-b border-r border-gray-300 w-[20%] text-center">Target Word</th>
                    <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Original Language</th>
                    <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Target Language</th>
                    <th className="p-3 border-b border-r border-gray-300 w-[15%] text-center">Date Modified</th>
                    <th className="p-3 border-b border-gray-300 w-[10%] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      onClick={() => setSelectedNotification(item)}
                    >
                      <td className="p-3 border-b border-r border-gray-200 text-center">{index + 1}</td>
                      <td className="p-3 border-b border-r border-gray-200 truncate max-w-[200px] text-center">{item.japanese}</td>
                      <td className="p-3 border-b border-r border-gray-200 truncate max-w-[200px] text-center">{item.english}</td>
                      <td className="p-3 border-b border-r border-gray-200 text-center">Japanese</td>
                      <td className="p-3 border-b border-r border-gray-200 text-center">English</td>
                      <td className="p-3 border-b border-r border-gray-200 text-center">{item.date_modified}</td>
                      <td className="p-3 border-b border-gray-200 text-center">
                        <button
                          className="text-green-500 hover:text-green-700 mr-2 text-xl cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptNotification(item);
                          }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(item.id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowNotifications(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleUpdateAll}
              >
                Update All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal table with improved styling */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-[60]" 
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          onClick={() => setSelectedNotification(null)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-11/12 max-h-[90vh] overflow-auto text-center border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg text-[#004098CC] font-bold mb-4">KEYWORD DETAILS</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden border-4 border-white">
                <thead>
                  <tr className="bg-[#004098CC] text-white ">
                    <th className="p-3 border-b border-r border-gray-300 w-1/5">Origin Word</th>
                    <th className="p-3 border-b border-r border-gray-300 w-1/5">Target Word</th>
                    <th className="p-3 border-b border-r border-gray-300 w-1/5">Original Language</th>
                    <th className="p-3 border-b border-r border-gray-300 w-1/5">Target Language</th>
                    <th className="p-3 border-b border-gray-300 w-1/5">Date Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-r border-gray-200 whitespace-normal break-words">
                      {selectedNotification.japanese}
                    </td>
                    <td className="p-3 border-b border-r border-gray-200 whitespace-normal break-words">
                      {selectedNotification.english}
                    </td>
                    <td className="p-3 border-b border-r border-gray-200 text-center">
                      Japanese
                    </td>
                    <td className="p-3 border-b border-r border-gray-200 text-center">
                      English
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center">
                      {selectedNotification.date_modified}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setSelectedNotification(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Editing Modal for Notification */}
      {editingNotification && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-[60]" 
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          onClick={() => setEditingNotification(null)}
        >
          <div 
            className="bg-white p-6 rounded shadow-lg max-w-4xl w-11/12 max-h-[90vh] overflow-auto text-center border-4 border-white"
            style={{ border: "2px solid #ccc" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">EDIT KEYWORD</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Saving edited notification:", editingNotification);
                setEditingNotification(null);
              }}
            >
              <div className="overflow-x-auto">
                <table className="border-collapse border-2 border-gray-400 w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border-2 border-gray-300 w-1/6">Japanese</th>
                      <th className="p-3 border-2 border-gray-300 w-1/6">English</th>
                      <th className="p-3 border-2 border-gray-300 w-1/6">Vietnamese</th>
                      <th className="p-3 border-2 border-gray-300 w-1/6">Chinese (Traditional)</th>
                      <th className="p-3 border-2 border-gray-300 w-1/6">Chinese (Simplified)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-2 border-gray-300">
                        <textarea
                          value={editingNotification.japanese}
                          onChange={(e) => setEditingNotification({
                            ...editingNotification,
                            japanese: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="p-3 border-2 border-gray-300">
                        <textarea
                          value={editingNotification.english}
                          onChange={(e) => setEditingNotification({
                            ...editingNotification,
                            english: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="p-3 border-2 border-gray-300">
                        <textarea
                          value={editingNotification.vietnamese}
                          onChange={(e) => setEditingNotification({
                            ...editingNotification,
                            vietnamese: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="p-3 border-2 border-gray-300">
                        <textarea
                          value={editingNotification.chinese_traditional}
                          onChange={(e) => setEditingNotification({
                            ...editingNotification,
                            chinese_traditional: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="p-3 border-2 border-gray-300">
                        <textarea
                          value={editingNotification.chinese_simplified}
                          onChange={(e) => setEditingNotification({
                            ...editingNotification,
                            chinese_simplified: e.target.value
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setEditingNotification(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-[70]" 
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          onClick={() => setShowConfirmation(false)}
        >
          <div 
            className="bg-white p-6 rounded shadow-lg max-w-md w-11/12 overflow-auto text-center border-4 border-white"
            style={{ border: "2px solid #ccc" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Confirmation</h3>
            <p className="mb-6">
              {confirmationType === 'single' 
                ? `Are you sure you want to update "${confirmingNotification.english}" to the private library?` 
                : "Are you sure you want to update all keywords to the private library?"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleConfirmUpdate}
              >
                Yes, Update
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordUpdate;
