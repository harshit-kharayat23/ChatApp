import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SignupPage from "./Pages/SignupPage";
import {Toaster} from "react-hot-toast";

function App() {

  return (

    
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
    <Toaster position="top-right" toastOptions={{ duration: 3000 }}/>
      <Routes>
          <Route path="/" element={ <HomePage/>} />
           <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />

          
      </Routes>
    </div>
  );
}

export default App;
