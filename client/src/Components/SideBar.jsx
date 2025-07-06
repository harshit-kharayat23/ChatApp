import React, { useState, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser, logOutUser } from "../Redux/userSlice";
import axios from 'axios';
import { BACKEND_URL } from '../lib/utils';
import toast from 'react-hot-toast';
import { FiSettings, FiLogOut } from "react-icons/fi";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, otherUsers, onlineUsers, selectedUser } = useSelector(store => store?.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const logoutMenuRef = useRef(null);

  // Hide logout menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredUsers = otherUsers?.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
      dispatch(logOutUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed!");
    }
  };

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 flex flex-col justify-between rounded-r-xl text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      
      {/* Top Section */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="pb-5">
          <div className="flex justify-between items-center">
            <img src={assets.logo} className="max-w-40" alt="Logo" />
            <div
              className="relative py-2 group cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img
                src={userData?.photo || assets.avatar_icon}
                className="w-[45px] aspect-square rounded-full bg-contain"
                alt={userData?.fullName}
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
            <img src={assets.search_icon} className="w-3" alt="Search" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
              placeholder="Search User ..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-300 hover:text-white text-lg px-1"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="flex flex-col overflow-y-auto max-h-[425px] md:max-h-[350px] lg:max-h-[365px] ">

          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                onClick={() => dispatch(setSelectedUser(user))}
                key={user._id}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded-md cursor-pointer max-sm:text-sm transition-all duration-200 ${
                  selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''
                }`}
              >
                <img
                  src={user?.photo || assets.avatar_icon}
                  className="w-[35px] aspect-square rounded-full"
                  alt={user.fullName}
                />
                <div className="flex flex-col leading-5">
                  <p>{user.fullName}</p>
                  {onlineUsers?.includes(user._id) ? (
                    <span className="text-green-400 text-xs">Online</span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Offline</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-300 mt-5">No users found</p>
          )}
        </div>
      </div>

      {/* Bottom Section - Settings */}
      <div className="relative mt-4 px-1" ref={logoutMenuRef}>
        <button
          onClick={() => setShowLogoutMenu((prev) => !prev)}
          className="flex items-center gap-2 text-white hover:text-violet-400 transition text-sm"
        >
          <FiSettings size={18} />
          Settings
        </button>

        {showLogoutMenu && (
          <div className="absolute bottom-10 left-0 bg-white text-black text-sm rounded shadow-md p-2 w-[150px] z-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-600"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
