# CRUD 2026 – MERN Task Management App

This is a MERN stack based CRUD application built for Assignment 2026.
The project is divided into two branches:
- **server** – Backend (Node.js, Express, MongoDB)
- **web** – Frontend (React.js + Tailwind CSS)
## 🔥 Features
- User Authentication (Login / JWT)
- Create, Read, Update, Delete Tasks
- Task Priority & Status
- Protected Routes
- Clean UI with Tailwind CSS
### Frontend (web branch)
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend (server branch)
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
## 📂 Project Structure

crud-2026-m-j
│
├── server → Backend API
│
└── web → Frontend Application

Run Backend (server)
cd server
npm install
npm start
Create a .env file inside server folder:

PORT=9000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run Frontend (web)
cd web
npm install
npm run dev


Create a .env file inside web folder:

VITE_REACT_APP_API=http://localhost:9000

👨‍💻 Author

Sonu Sahu
MERN Stack Developer
GitHub: https://github.com/SONUSAHUNAYAGAON

⭐ Note

This project is created for learning and assignment purposes.
