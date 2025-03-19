import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket"; // Import the socket instance
import ContactList from "../components/ContactList";
import SearchContacts from "../components/SearchContacts";
import ChatRoomList from "../components/ChatRoomList";
import ChatPopup from "../components/ChatPopup";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true); // Initially loading rooms
  const [roomError, setRoomError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (!user) return;

    console.log("Establishing socket connection..."); // Debugging log

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server"); // Debugging log
      fetchChatRooms();
    });

    socket.on("roomList", (rooms) => {
      console.log("Received roomList event:", rooms); // Debugging log
      setChatRooms(rooms);
      setIsLoadingRooms(false); // Stop loading once rooms are fetched
    });

    socket.on("roomCreated", (newRoom) => {
      console.log("Received roomCreated event:", newRoom); // Debugging log
      setChatRooms((prevRooms) => [...prevRooms, newRoom]);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setErrorMessage("");
      setRoomError(""); // Clear any previous room errors
    });

    socket.on("roomError", (error) => {
      console.log("Received roomError event:", error); // Debugging log
      setRoomError(error);
      setIsLoadingRooms(false); // Stop loading in case of error
    });

    return () => {
      socket.off("connect");
      socket.off("roomList");
      socket.off("roomCreated");
      socket.off("roomError");
    };
  }, [user]);

  const fetchChatRooms = () => {
    console.log("Fetching chat rooms..."); // Debugging log
    setIsLoadingRooms(true); // Start loading when fetching rooms
    socket.emit("getRooms");
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      setRoomError(""); // Clear any previous room errors
      console.log("Creating room with name:", newRoomName); // Debugging log
      socket.emit("createRoom", { name: newRoomName }, (response) => {
        console.log("Create room response:", response); // Debugging log
        if (response.success) {
          setNewRoomName("");
          setErrorMessage("");
        } else {
          setRoomError("Failed to create room. Please try again.");
        }
      });
    } else {
      setRoomError("Please enter a valid room name.");
    }
  };

  const handleEnterRoom = (roomId) => {
    console.log("Entering room with ID:", roomId); // Debugging log
    setIsLoadingRooms(true); // Start loading when entering a room
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging log
    logout();
    navigate("/login");
  };

  const handleAddContact = (newContact) => {
    const firstName = newContact.firstName;
    const lastName = newContact.lastName;

    if (!firstName || !lastName) {
      alert("Invalid contact data. Please try again.");
      return;
    }

    const isContactAlreadyAdded = contacts.some(
      (contact) =>
        contact.firstName.toLowerCase() === firstName.toLowerCase() &&
        contact.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (!isContactAlreadyAdded) {
      setContacts((prevContacts) => [...prevContacts, newContact]);
    } else {
      alert("Contact already added!");
    }
  };

  const handleContactClick = (contact) => {
    console.log("Contact clicked:", contact); // Debugging log
    setSelectedContact(contact);
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
          <div className="chat-room-section">
            <h2>Chat Rooms</h2>
            {isLoadingRooms ? (
              <p>Loading chat rooms...</p>
            ) : chatRooms.length === 0 ? (
              <p>No rooms. Create one below:</p>
            ) : (
              <ChatRoomList
                chatRooms={chatRooms}
                onEnterRoom={handleEnterRoom}
                isLoading={isLoadingRooms}
                error={roomError}
              />
            )}
            <div className="create-room-section">
              <h3>Create a New Room</h3>
              <input
                type="text"
                placeholder="Enter Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button onClick={handleCreateRoom}>Create Room</button>
              {roomError && <div className="error-message">{roomError}</div>}
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="contact-section">
            <h2>Contacts</h2>
            <ContactList contacts={contacts} onContactClick={handleContactClick} />
            <SearchContacts onAddContact={handleAddContact} />
          </div>
        </div>

        {showPopup && (
          <div className="success-popup">
            <p>Room "{newRoomName}" created successfully!</p>
          </div>
        )}

        {selectedContact && (
          <div className="selected-contact">
            <h3>Selected Contact</h3>
            <ChatPopup contact={selectedContact} onClose={() => setSelectedContact(null)} />
            <div className="selected-contact-info">
              <p>Contact ID: {selectedContact._id}</p> {/* Use _id instead of id */}
              <p>First Name: {selectedContact.firstName}</p>
              <p>Last Name: {selectedContact.lastName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;