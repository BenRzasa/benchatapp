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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(false); // Initially disabled
  const [roomError, setRoomError] = useState("");

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
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setErrorMessage("");
      });

      // Listen for errors
      socket.on("roomError", (error) => {
        setRoomError(error);
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("roomList");
        socket.off("roomCreated");
        socket.off("roomError");
      };
    }
  }, [user]); // Only re-run if the user changes

  const fetchChatRooms = () => {
    socket.emit("getRooms");
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit("createRoom", { name: newRoomName }, (response) => {
        if (response.success) {
          setNewRoomName("");
        } else {
          setRoomError("Failed to create room. Please try again.");
        }
      });
    } else {
      setRoomError("Please enter a valid room name.");
    }
  };

  const handleEnterRoom = (roomId) => {
    setIsLoadingRooms(true); // Enable loading when a room is selected
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddContact = (newContact) => {
    console.log("New Contact:", newContact); // Debugging

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
          <ChatRoomList
            chatRooms={chatRooms}
            onEnterRoom={handleEnterRoom}
            isLoading={isLoadingRooms}
            error={roomError}
          />
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