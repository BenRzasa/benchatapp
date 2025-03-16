import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";
import ContactList from "../components/ContactList";
import SearchContacts from "../components/SearchContacts";
import ChatRoomList from "../components/ChatRoomList";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Fetch chat rooms on component mount
  useEffect(() => {
    if (user) {
      fetchChatRooms();

      // Listen for updated room lists from the server
      socket.on("roomList", (rooms) => {
        setChatRooms(rooms);
      });

      // Listen for new rooms created by the current user
      socket.on("roomCreated", (newRoom) => {
        setChatRooms((prevRooms) => [...prevRooms, newRoom]);
        setShowPopup(true); // Show success popup
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
        setErrorMessage(""); // Clear any previous error messages
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("roomList");
        socket.off("roomCreated");
      };
    }
  }, [user]);

  // Fetch the list of chat rooms
  const fetchChatRooms = () => {
    socket.emit("getRooms");
  };

  // Handle creating a new chat room
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName }, (response) => {
        if (response.success) {
          setNewRoomName(""); // Clear the input field
          alert("New room ", {newRoomName}, " created successfully!");
        } else {
          setErrorMessage("Failed to create room. Please try again."); // Set error message
        }
      });
    } else {
      setErrorMessage("Please enter a valid room name."); // Set error message
    }
  };

  // Handle entering a chat room
  const handleEnterRoom = (roomId) => {
    navigate(`/room/${roomId}`); // Navigate to the room page
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

const handleAddContact = (contact) => {
  console.log("Contact to add:", contact);
  console.log("Current contacts:", contacts);

  // Check if the contact is already in the list
  const isContactAlreadyAdded = contacts.some(
    (c) => c.id === contact.id // Use a unique identifier like `id` instead of username or email
  );

  if (!isContactAlreadyAdded) {
    // Add the new contact to the list
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts, contact];
      console.log("Updated contacts:", newContacts);
      return newContacts;
    });
  } else {
    alert("Contact already added!");
  }
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
          <ChatRoomList chatRooms={chatRooms} onEnterRoom={handleEnterRoom} />
          <div className="create-room-section">
            <input
              type="text"
              placeholder="New Room Name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        </div>

        <div className="right-side">
          <ContactList contacts={contacts} />
          <SearchContacts onAddContact={handleAddContact} />
        </div>

        {showPopup && (
          <div className="success-popup">
            <p>Room "{newRoomName}" created successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;