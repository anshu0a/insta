import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

function SocketManager({ setUser, userid, children, setNotomsg, setNews }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.post(
          "https://instaserver-knen.onrender.com/askforuserid",
          {},
          { withCredentials: true }
        );
        if (response.data !== "") {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Something went wrong", error);
      }
    };

    fetchUserInfo();
  }, [location.pathname]);

  const excludedRoutes = ['/login', '/creating'];
  const socketEnabled = !excludedRoutes.includes(location.pathname.toLowerCase()) && userid;

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socketEnabled || !userid) return;

    const newSocket = io("https://instaserver-knen.onrender.com");


    newSocket.on("connect", () => {
      newSocket.emit("authenticate", userid);
    });


    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on(userid, (msg) => {
      setNews(msg);
    });

    newSocket.on("noti" + userid, (noti) => {
      setNotomsg(noti);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [socketEnabled, userid]);


  const disconnect = () => {
    if (socket) socket.disconnect();
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketManager;
