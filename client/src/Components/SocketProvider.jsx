import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers } from "../Redux/userSlice";

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData && !socket) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        query: { userId: userData._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
