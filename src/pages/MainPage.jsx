import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";
import ContactList from "../components/ContactList";
import SearchContacts from "../components/SearchContacts";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch chat rooms on component mount
  useEffect(() => {
    if (user) {
      fetchChatRooms();
      socket.on("roomList", (rooms) => {
        setChatRooms(rooms);
      });
      return () => {
        socket.off("roomList");
      };
    }
  }, [user]);

  const fetchChatRooms = () => {
    socket.emit("getRooms");
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName });
      setNewRoomName("");
      alert("Room created successfully!");
      fetchChatRooms();
    } else {
      alert("Please enter a valid room name.");
    }
  };

  const handleEnterRoom = (roomId) => {
    setSelectedRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-page">
      <div className="header">
        <h1>Welcome to Benchat, {user?.firstName || "User"}!</h1>
        <div className="buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="content">
        <div className="left-side">
          <div className="chat-room-list">
            <h2>Chat Rooms</h2>
            <ul>
              {chatRooms
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((room) => (
                  <li key={room.id} onClick={() => handleEnterRoom(room.id)}>
                    {room.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="right-side">
          <ContactList />
          <SearchContacts /> {/* Replace the placeholder search with the SearchContacts component */}
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