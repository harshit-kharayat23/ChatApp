import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userId, children, onGetOnlineUsers }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        query: { userId },
      });

      setSocket(newSocket);

      // Add the getOnlineUsers listener here!
      newSocket.on("getOnlineUsers", (users) => {
        if (onGetOnlineUsers) onGetOnlineUsers(users);
      });

      return () => newSocket.disconnect();
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
