import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";

const ChatRoomList = () => {
  const { user } = useContext(AuthContext);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit("getRooms");

      socket.on("roomList", (rooms) => {
        setChatRooms(rooms);
      });

      return () => {
        socket.off("roomList");
      };
    }
  }, [user]);

  return (
    <div>
      <h2>Chat Rooms</h2>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;