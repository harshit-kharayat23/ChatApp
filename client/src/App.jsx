import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SignupPage from "./Pages/SignupPage";
import { Toaster } from "react-hot-toast";
import { useCurrentUser } from "./Hooks/useCurrentUser";
import { useSelector } from "react-redux";
import { useOtherUsers } from "./Hooks/getOtherUsers";
import { useEffect } from "react";

function App() {
  
    useCurrentUser();
    useOtherUsers();
  const userData = useSelector((state) => state?.user?.loggedInUser);
 

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-center min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        <Route path="/" element={userData ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!userData ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!userData ? <SignupPage /> : <Navigate to="/profile" />} />
        <Route path="/profile" element={userData ? <ProfilePage /> : <Navigate to="/signup" />} />
      </Routes>
    </div>
  );
}

export default App;
