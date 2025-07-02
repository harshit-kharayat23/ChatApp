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
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./Redux/userSlice";

function App() {
  useCurrentUser();
  useOtherUsers();
  const dispatch = useDispatch();
  const { userData, webSocket, onlineUsers } = useSelector(
    (state) => state?.user
  );

  useEffect(() => {
    let socket;

    if (userData && !webSocket) {
      socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        query: { userId: userData._id },
      });

      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (users) => {
        console.log("📡 Received Online Users: ", users);
        dispatch(setOnlineUsers(users));
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userData, dispatch]);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-center min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        <Route
          path="/"
          element={userData ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!userData ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!userData ? <SignupPage /> : <Navigate to="/profile" />}
        />
        <Route
          path="/profile"
          element={userData ? <ProfilePage /> : <Navigate to="/signup" />}
        />
      </Routes>
    </div>
  );
}

export default App;
