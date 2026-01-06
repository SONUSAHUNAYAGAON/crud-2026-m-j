const Task = require("../models/taskModel");
const userModel = require("../models/userModel");

// Create a new task
const createTask = async (req, res) => {
  try {
    const existingUser = await userModel.findById(req.user._id);
    if (!existingUser) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }

    const { title, description, dueDate, priority } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      userId: req.user._id,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(400).json({ message: "Failed to create task", error: error.message });
  }
};

// Get all tasks with pagination
const getAllTask = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const tasks = await Task.find({ userId: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments({ userId: req.user._id });

    res.status(200).json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Get a specific task by taskId
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to access this task" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task", error: error.message });
  }
};

// Update a task by taskId
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to update this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(400).json({ message: "Failed to update task", error: error.message });
  }
};

// Delete a task by taskId
const deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

// Update task status by taskId
const updateTaskByStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to update status of this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Task status updated successfully", task: updatedTask });
  } catch (error) {
    res.status(400).json({ message: "Failed to update task status", error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTaskById,
  updateTaskByStatus,
};
