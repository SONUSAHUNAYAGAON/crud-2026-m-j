import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateTask = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState(""); // State for due date
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !priority || !dueDate) {
      return toast.error("Please fill all fields");
    }
    const formData = {
      title,
      description,
      priority,
      dueDate,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      console.log(apiUrl, "apiUrl");
      const response = await axios.post(`${apiUrl}/api/task`, formData, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      console.log(response, "response");

      if (response.status === 201) {
        navigate("/home");
        toast.success("task created successfully");
      } else {
        toast.error("something went wrong");
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setPriority("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add task", error);
      // Handle error appropriately
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

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-xl font-bold border-b border-black pb-1 text-black">
          Add Task
        </h1>
        <button
          className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
          onClick={() => navigate("/home")}
        >
          All Tasks
        </button>
      </div>

      {/* Add Task Form */}
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow"
        >
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title..."
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows="4"
              placeholder="Enter description..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={handlePriorityChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={handleDueDateChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
