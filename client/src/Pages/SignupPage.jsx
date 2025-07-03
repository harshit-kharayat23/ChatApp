import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from 'react-redux'
import { addUser } from "../Redux/userSlice";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch= useDispatch();
  const navigate=useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BACKEND_URL + "/signup",
        { fullName, emailId, password },
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "SignUp successful!");
      dispatch(addUser(response?.data?.userData))
      navigate("/profile")
      setEmailId("");
      setFullName("");
      setPassword("");
      
    }catch (err) {
  console.log("Catch block fired with error:", err);
  const message = err?.response?.data?.message || "Something went wrong.";
  toast.error(message);
}


  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

       <form
        onSubmit={handleSignUp}
        className="w-[min(90vw,400px)] border-2 bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-6 rounded-lg shadow-lg backdrop-blur-md"
      >
        <h2 className="font-medium text-2xl">Sign Up</h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          placeholder="Full Name"
          required
        />

        <input
          onChange={(e) => setEmailId(e.target.value)}
          value={emailId}
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

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Create Account
        </button>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
