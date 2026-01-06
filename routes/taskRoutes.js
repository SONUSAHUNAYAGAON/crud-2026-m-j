const express = require("express");
const taskRouter = express.Router();
const auth = require("../middleware/auth");
const  {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTaskById,
  updateTaskByStatus,
} = require("../controllers/taskController");
// Create a new task
taskRouter.post("/", auth, createTask);

// Get all tasks
taskRouter.get("/", auth, getAllTask);

// Get a specific task by taskId
taskRouter.get("/:taskId", auth, getTaskById);

// Update a task by taskId
taskRouter.patch("/:taskId", auth, updateTask);

// Delete a task by taskId
taskRouter.delete("/:taskId", auth, deleteTaskById);

// Update task status by taskId
taskRouter.put("/:taskId/update-status", auth, updateTaskByStatus);


module.exports = taskRouter;
