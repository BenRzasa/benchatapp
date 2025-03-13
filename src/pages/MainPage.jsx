import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  // Fetch chat rooms on component mount
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

  // Handle creating a new chat room
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName });
      setNewRoomName("");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // If the user is not logged in, show the Login/Signup screen
  if (!user) {
    return (
      <div className="welcome-container">
        <h1>Welcome to Benchat!</h1>
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </div>
    );
  }

  // If the user is logged in, show the Main Page
  return (
    <div className="main-page">
      <div className="header">
        <div className="buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/chat")}>Chat Rooms</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Hello, {user.firstName || "User"}!</h1>
      </div>
      <div className="content">
        <div className="chat-room-list">
          <h2>Chat Rooms</h2>
          <ul>
            {chatRooms
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
              .map((room) => (
                <li key={room.id}>{room.name}</li>
              ))}
          </ul>
        </div>
        {chatRooms.length === 0 && (
          <div className="create-room-popup">
            <p>No chat rooms created yet. Create one below:</p>
            <div className="create-room-input">
              <input
                type="text"
                placeholder="New Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button onClick={handleCreateRoom}>Create Room</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;