import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SignupPage from "./Pages/SignupPage";
import { Toaster } from "react-hot-toast";
import { useCurrentUser } from "./Hooks/useCurrentUser";
import { useOtherUsers } from "./Hooks/getOtherUsers";
import { SocketProvider } from "./contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, addUser } from "./Redux/userSlice";
import bgImage from "./assets/bgImage.svg";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state?.user);

  // 🟨 Restore Redux state from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      dispatch(addUser({ user: JSON.parse(storedUser), token: storedToken }));
    }
  }, [dispatch]);

  useCurrentUser(); // 🔁 Fetch current user data again to keep synced
  useOtherUsers();  // 👥 Get other users when userData is available

  const handleOnlineUsers = (users) => {
    dispatch(setOnlineUsers(users));
  };

  return (
    <SocketProvider userId={userData?._id} onGetOnlineUsers={handleOnlineUsers}>
      <div
        className="bg-cover bg-center min-h-screen"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
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
    </SocketProvider>
  );
}

export default App;
