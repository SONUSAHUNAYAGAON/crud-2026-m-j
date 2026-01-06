const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const connectDB = require("./config/db");
const cors = require("cors");

// Connect DB
connectDB().then(() => {
  console.log("MongoDB connected successfully");
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
