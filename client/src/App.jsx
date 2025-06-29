import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
          <Route path="/" element={<HomePage/>} />
           <Route path="/login" element={<LoginPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />

          
      </Routes>
    </div>
  );
}

export default App;
