// src/components/MainPage.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";
import axios from "axios";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchChatRooms();
      fetchContacts();

      // Listen for updates to the room list
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

  const fetchContacts = async () => {
    try {
      const response = await axios.post(
        "https://quality-visually-stinkbug.ngrok-free.app/api/contacts/search",
        { searchTerm },
        {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName, userId: user.id });
      setNewRoomName("");
      alert("Room created successfully!");
    } else {
      alert("Please enter a valid room name.");
    }
  };

  const handleEnterRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-page">
      <div className="header">
        <h1>Welcome to Benchat, {user.firstName || "User"}!</h1>
        <div className="buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="content">
        {/* Left Side: Chat Rooms */}
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

        {/* Right Side: Contacts and Search */}
        <div className="right-side">
          <div className="contact-list">
            <h2>Contacts</h2>
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>{contact.name}</li>
              ))}
            </ul>
          </div>

          <div className="search-contacts">
            <h2>Search Contacts</h2>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={fetchContacts}>Search</button>
          </div>
        </div>

        {/* Create Room Popup */}
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