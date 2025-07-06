import React from "react";
import assets from "../assets/assets";
import axios from "axios";
import { BACKEND_URL } from "../lib/utils";
import toast from "react-hot-toast";
import { addOtherUsers, addUser, logOutUser } from "../Redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const RightSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });

      dispatch(logOutUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error(err?.response?.data?.message || "Logout failed!");
    }
  };

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full flex flex-col relative overflow-y-auto ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile Section */}
        <div className="pt-14 flex flex-col items-center gap-2 text-xs font-light px-4">
          <img
            src={selectedUser?.photo || assets.avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full object-cover"
          />
          <h1 className="px-4 text-lg font-medium flex items-center gap-2 text-center">
            {selectedUser.fullName}
          </h1>
          <p className="px-3 text-center text-sm opacity-90">
            {selectedUser.bio}
          </p>
        </div>

        <hr className="border-[#ffffff30] my-4" />

        {/* Media Section */}
        <div className="px-5 text-xs overflow-hidden">
          <p className="text-sm text-gray-200 mb-2 font-medium">Media</p>
          <div className="max-h-[250px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
            {messages
              .filter((msg) => msg.image)
              .slice()
              .reverse()
              .map((msg, index) => (
                <div
                  key={index}
                  onClick={() => window.open(msg.image, "_blank")}
                  className="cursor-pointer overflow-hidden rounded"
                >
                  <img
                    src={msg.image}
                    alt="media"
                    className="w-full h-24 sm:h-28 object-cover rounded-md"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto mb-4 mx-auto bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-16 rounded-full cursor-pointer transition-all duration-200 hover:opacity-90"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSideBar;
