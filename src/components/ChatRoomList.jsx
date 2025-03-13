import React, { useState, useEffect } from "react";
import socket from "../api/socket";
import "../styles/ChatRoom.css";

const ChatRoomList = ({ onRoomSelect }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  // Fetch existing chat rooms on component mount
  useEffect(() => {
    socket.emit("getRooms");

    socket.on("roomList", (rooms) => {
      setChatRooms(rooms);
    });

    return () => {
      socket.off("roomList");
    };
  }, []);

  // Handle creating a new chat room
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName });
      setNewRoomName("");
    }
  };

  // Handle selecting a chat room
  const handleRoomSelect = (room) => {
    onRoomSelect(room);
  };

  return (
    <div className="chat-room-list">
      <h2>Chat Rooms</h2>
      <div className="create-room">
        <input
          type="text"
          placeholder="New Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.id} onClick={() => handleRoomSelect(room)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;