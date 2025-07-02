import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BACKEND_URL + "/login",
        { emailId: email, password },
        { withCredentials: true }
      );
      dispatch(addUser(response?.data?.userData));
      
      setEmail("");
      setPassword("");
      toast.success(response.data.message || "Login successful!");

    } catch (err) {
        const message=err?.response?.data?.message;
        toast.error(message)
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      <form
        onSubmit={handleLogin}
        className="w-[min(90vw,400px)] border-2 bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-6 rounded-lg shadow-lg backdrop-blur-md"
      >

        <h2 className="font-medium text-2xl">Login</h2>

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <div className="relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 pr-10 w-full border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-sm text-violet-400 select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Login Now
        </button>

        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium text-violet-500">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
