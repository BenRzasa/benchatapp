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
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  // If the user is not logged in, show the Welcome page
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
        <h1>Welcome to Benchat, {user.firstName || "User"}!</h1>
        <div className="buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/chat")}>Chat Rooms</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="content">
        <div className="radio-container" style={{ "--total-radio": chatRooms.length }}>
          <div className="glider-container">
            <div className="glider"></div>
          </div>
          {chatRooms
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
            .map((room, index) => (
              <div key={room.id}>
                <input
                  type="radio"
                  id={`room-${room.id}`}
                  name="room"
                  checked={selectedRoom === room.id}
                  onChange={() => setSelectedRoom(room.id)}
                />
                <label htmlFor={`room-${room.id}`}>{room.name}</label>
              </div>
            ))}
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