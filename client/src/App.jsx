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
import { setOnlineUsers } from "./Redux/userSlice";
import bgImage from "./assets/bgImage.svg";


function App() {
  useCurrentUser();
  useOtherUsers();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state?.user);

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
