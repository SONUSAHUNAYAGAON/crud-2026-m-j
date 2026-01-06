import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // set the userName
  const handleChangeUserName = (event) => {
    setUserName(event.target.value);
  };
  // set the email id
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  // set the password
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!email || !password || !userName) {
      toast.error("Please fill in all fields");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API}/api/user/signup`,
      { email, password, userName },
      { timeout: 8000 }
    );
    console.log(response, "signup response");

    if (response.status === 201) {
      toast.success("User created successfully");
      setEmail("");
      setPassword("");
      setUserName("");
      navigate("/");
    }

  } catch (error) {
    console.error("Signup error:", error);

    // ✅ Server response error
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 400 && message === "user_already_exist") {
        toast.error("User already exists!");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message || "Request failed!");
      }
    }

    // ✅ Server not responding
    else if (error.request) {
      toast.error("Server not responding. Please try again later.");
    }

    // ✅ Unknown error
    else {
      toast.error("Unexpected error occurred!");
    }
  }
};



  return (
    <>
      <div id="loginpage">
        <div id="loginform" className=" bg-white p-20 rounded-md shadow-xl ">
          <h1 className=" text-center mb-5">Sign Up!!!</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">User Name:</label>
            <br />
            <input
              type="text"
              id="username"
              value={userName}
              placeholder="Enter your user name..."
              className="w-full p-2 my-1 border border-gray-300 rounded-sm"
              onChange={handleChangeUserName}
            />
            <br />
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
              Sign Up
            </button>
          </form>
          <div>
            <p className="mb-0">
              Don't have an account?{" "}
              <button
                className="text-indigo-400"
                onClick={() => navigate("/")} // Correct usage of navigate in click handler
              >
                Sign in!!!
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
