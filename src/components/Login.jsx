import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // get token for login user if not token then redirect to login page
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

   // set the email id
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  // set the password
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  // handle user login
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    if(!email || !password){
      toast.error("Please fill in all fields");
      return;
    }
    const { status, data } = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API}/api/user/signin`,
      { email, password },
      {
        timeout: 8000, // ⏱️ server slow/down case
      }
    );

    if (status === 200 || status === 201) {
      localStorage.setItem("token", data?.token);
      toast.success("User logged in successfully");
      navigate("/home");
    } else {
      toast.error("Credentials do not match");
    }

  } catch (error) {
    console.error("Login error:", error);

    // 🔴 Server responded with error
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 || status === 400) {
        toast.error("Invalid email or password");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(data?.message || "Login failed!");
      }
    }
    // 🔴 Server not responding / network issue
    else if (error.request) {
      toast.error("Server not responding. Please check your internet connection.");
    }
    // 🔴 Unknown error
    else {
      toast.error("Unexpected error occurred!");
    }
  }
};


  return (
    <>
     <div id="loginpage">
        <div id="loginform" className=" bg-white p-20 rounded-md shadow-xl ">
          <h1 className=" text-center mb-5">Login!!!</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Your Email:</label>
            <br />
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              className="w-full p-2 my-1 border border-gray-300 rounded-sm"
              onChange={handleChangeEmail}
            />
            <br />
            <label htmlFor="password">Password:</label>
            <br />
            <input
              type="password"
              value={password}
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 my-1 border border-gray-300 rounded-sm"
              onChange={handleChangePassword}
            />

            <br />
            <br />
            <button
              type="submit"
              className="w-full p-3 my-2  rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
            >
              Login
            </button>
          </form>
           <div>
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <button
                        className="text-indigo-400"
                        onClick={() => navigate("/signup")} // Correct usage of navigate in click handler
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
        </div>
      </div>
    </>
  );
};

export default Login;
