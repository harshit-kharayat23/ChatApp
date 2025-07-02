import React from "react";
import SideBar from "../Components/SideBar";
import ChatContainer from "../Components/ChatContainer";
import RightSideBar from "../Components/RightSideBar";
import { useGetMessages } from "../Hooks/useGetMessages";
import {useSelector} from "react-redux";

const HomePage = () => {


  useGetMessages();
  const {selectedUser}=useSelector(store=>store.user);
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] text-amber-50">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] "
            : "md:grid-cols-2"
        }`}
      >
        <SideBar />
        <ChatContainer/>
        <RightSideBar/>
      </div>
    </div>
  );
};

export default HomePage;
