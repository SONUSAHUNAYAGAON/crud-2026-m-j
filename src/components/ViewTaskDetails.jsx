import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewTaskDetails = () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const [singleTask, setSingleTask] = useState({});
  const [loading, setLoading] = useState(true);

  
  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Get taskId from URL
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const taskId = urlParams.get("taskId");

  // Fetch task details
useEffect(() => {
  const getOneTaskData = async () => {
    try {
      if (token) {
        setLoading(true); // 🔄 start loader

        const response = await axios.get(
          `${apiUrl}/api/task/${taskId}`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        setSingleTask(response.data);
      }
    } catch (error) {
      console.error("Error getting task:", error);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  getOneTaskData();
}, [token, taskId]);


  // Format date
  const formateTaskData = (dateString) => {
    if (!dateString) return "";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const taskDate = new Date(dateString);
    return taskDate.toLocaleDateString("en-GB", options);
  };

  return (
    <main>
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white text-black p-4 w-full mb-4 rounded shadow">
        <h1 className="text-xl font-bold">Sonu Sahu</h1>
        <div className="flex items-center">
          <span className="mx-2 my-1">{currentUser?.userName}</span>
          <button
            className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl text-black font-bold mb-4">
          Task Details ✨
        </h1>

        {/* Card */}
       <div className="bg-white shadow-lg rounded border border-gray-200 p-6">
  <button
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mb-6"
    onClick={() => navigate(-1)}
  >
    &larr; Back
  </button>

  {loading ? (
    <div className="flex justify-center items-center h-60">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="space-y-4">
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </span>
        <div className="p-3 border border-gray-300 rounded bg-gray-50">
          {singleTask?.title}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </span>
        <div className="p-3 border border-gray-300 rounded bg-gray-50">
          {singleTask?.description}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </span>
        <div className="p-3 border border-gray-300 rounded bg-gray-50 capitalize">
          {singleTask?.priority}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </span>
        <div className="p-3 border border-gray-300 rounded bg-gray-50">
          {formateTaskData(singleTask?.dueDate)}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </span>
        <div className="p-3 border border-gray-300 rounded bg-gray-50 capitalize">
          {singleTask?.status}
        </div>
      </div>
    </div>
  )}
</div>

      </div>
    </main>
  );
};

export default ViewTaskDetails;
