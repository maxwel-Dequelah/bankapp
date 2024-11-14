import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/logo2.webp";

const backend_url = import.meta.env.VITE_APP_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/login/`, {
        username,
        password,
      });
      // Handle success response (e.g., save token, redirect)
      console.log("Login successful:", response.data);
      const accessToken = response.data.tokens.access;
      console.log(accessToken);
      navigate("/dashboard");
      localStorage.setItem("accessToken", accessToken);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img
            onClick={() => {
              navigate("/");
            }}
            src={logo2} // Replace with your logo path
            alt="Banking App Logo"
            className="w-40 h-40 mb-4 cursor-pointer"
          />

          <h2 className="text-2xl font-semibold">Log In</h2>
          <p className="text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-800 rounded-lg hover:bg-green-700"
          >
            LOGIN
          </button>
        </form>
        <div className="flex justify-between text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
          <a href="/signup" className="hover:underline text-green-700">
            Signup
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
