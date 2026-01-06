import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditTask = () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);     // page loader
const [updating, setUpdating] = useState(false); // button loader
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const taskId = urlParams.get("taskId");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleDueDateChange = (e) => setDueDate(e.target.value);

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

        setTitle(response?.data?.title);
        setDescription(response?.data?.description);

        const formattedDueDate = new Date(response?.data?.dueDate)
          .toISOString()
          .split("T")[0];
        setDueDate(formattedDueDate);
      }
    } catch (error) {
      console.error("Error get one task:", error);
      toast.error("Failed to load task");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  getOneTaskData();
}, [token, taskId]);


 const handleUpdateTask = async () => {
  if (!title || !description || !dueDate) {
    return toast.error("Please fill all fields");
  }

  try {
    setUpdating(true); // ⏳ start button loader

    const response = await axios.patch(
      `${apiUrl}/api/task/${taskId}`,
      { title, description, dueDate },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    if (response.status === 200) {
      toast.success("Task updated successfully");
      navigate("/home");
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.error("Failed to update task", error);
    toast.error("Update failed");
  } finally {
    setUpdating(false); // ✅ stop button loader
  }
};

  return (
    <>
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
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-xl font-bold border-b border-black pb-1 text-black">
          Edit Task
        </h1>
        <button
          className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
          onClick={() => navigate("/home")}
        >
          All Tasks
        </button>
      </div>

      {/* Form */}
     <div className="flex justify-center items-center min-h-screen">
  {loading ? (
    <div className="flex justify-center items-center h-60">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
      {/* Title */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>

      {/* Due Date */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleUpdateTask}
        disabled={updating}
        className={`w-full py-3 text-white font-bold rounded 
          ${updating ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        {updating ? "Updating..." : "Update"}
      </button>
    </div>
  )}
</div>

    </>
  );
};

export default EditTask;
