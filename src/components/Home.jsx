import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Home = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const [taskData, setTaskData] = useState([]);
  const [statusOptions] = useState(["Pending", "Completed"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // if(not token then redirect to login page)
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);
  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("User logout successfully");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  //// On page load
  useEffect(() => {
    fetchTasks(currentPage);
  }, [token, navigate]);
  // fetch all task data
  const fetchTasks = async (page) => {
    try {
      if (token) {
        setLoading(true); // 🔄 start loader

        const response = await axios.get(
          `${apiUrl}/api/task?page=${page}&limit=5`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        setTaskData(response.data.tasks);
        setTotalPages(response.data.pages);
        setCurrentPage(response.data.page);
      }
    } catch (error) {
      console.error("Error get all tasks:", error);
    } finally {
      setLoading(false); // ✅ stop loader (success or error)
    }
  };

  // handle delete
  const handleDelete = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for delete
      cancelButtonColor: "#3085d6", // Blue for cancel
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true, // Optional: places Cancel on left, Delete on right
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${apiUrl}/api/task/${taskId}`, {
            headers: {
              Authorization: `JWT ${token}`,
            },
          });

          if (response?.status === 200) {
            fetchTasks(currentPage);
            Swal.fire("Deleted!", "The Task has been deleted.", "success");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Error!", "Failed to delete the task.", "error");
        }
      }
    });
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchTasks(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1);
    }
  };

  //   time zone convert
  const formateTaskData = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour12: true,
    };

    const taskDate = new Date(dateString);
    const formattedDate = taskDate.toLocaleString("en-GB", options);

    return formattedDate;
  };

  // Handle status change for a task
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${apiUrl}/api/task/${taskId}/update-status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      fetchTasks(currentPage);
      Swal.fire("Updated!", "Task status has been updated.", "success");
    } catch (error) {
      console.error("Error updating task status:", error);
      Swal.fire("Error!", "Failed to update task status.", "error");
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white text-black p-4 w-full mb-4 rounded shadow">
        <h1 className="text-xl font-bold">Sonu Sahu</h1>
        <div className="flex items-center">
          <span className="mx-2 my-1 text-gray-700">
            {currentUser?.userName}
          </span>
          <button
            className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="w-full mb-4 flex justify-end items-center">
        <button
          onClick={() => navigate("/add-task")}
          className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded mr-3"
        >
          Add Task
        </button>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">
                  <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : taskData?.length > 0 ? (
              taskData.map((task, index) => (
                <tr key={task._id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{formateTaskData(task.dueDate)}</td>
                  <td className="px-4 py-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="w-full p-2 rounded border border-gray-300"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit/task?taskId=${task._id}`)}
                      className="bg-blue-500 text-white py-2 px-3 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white py-2 px-3 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/task/view/details?taskId=${task._id}`)
                      }
                      className="bg-yellow-500 text-white py-2 px-3 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-6 space-x-2 px-20">
          {currentPage > 1 && (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
              onClick={handlePreviousPage}
            >
              Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
