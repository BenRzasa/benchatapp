import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import apiClient from "../api/apiClient";
import ContactList from "../components/ContactList";
import SearchContacts from "../components/SearchContacts";
import ChatPopup from "../components/ChatPopup";
import "../styles/MainPage.css";

const MainPage = () => {
  const { user, logout, updateUser } = useContext(AuthContext); // Add updateUser from AuthContext
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]); // List of all contacts
  const [chatRooms, setChatRooms] = useState([]); // List of chat rooms (contacts with active chats)
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact for ChatPopup
  // eslint-disable-next-line
  const [isLoadingContacts, setIsLoadingContacts] = useState(true); // Loading state for contacts
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch contacts ONCE on component mount
  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  // Fetch contacts using the REST API
  const fetchContacts = async () => {
    console.log("Fetching contacts...");
    setIsLoadingContacts(true); // Start loading
    try {
      const response = await apiClient.get("/api/contacts/get-contacts-for-list");
      console.log("Contacts fetched:", response.data);
      setContacts(response.data.contacts); // Update contacts state
      setIsLoadingContacts(false); // Stop loading
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setErrorMessage("Failed to fetch contacts. Please try again.");
      setIsLoadingContacts(false); // Stop loading in case of error
    }
  };

  // Handle searching for contacts
  const handleSearchContacts = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    try {
      const response = await apiClient.post("/api/contacts/search", {
        searchTerm: searchTerm,
      });
      console.log("Search results:", response.data);
      if (response.data.contacts.length > 0) {
        setContacts(response.data.contacts); // Update contacts state with search results
      } else {
        setErrorMessage("No contacts found.");
      }
    } catch (error) {
      console.error("Failed to search for contacts:", error);
      setErrorMessage("Failed to search for contacts. Please try again.");
    }
  };

  // Handle adding a new contact
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
      setContacts((prevContacts) => [...prevContacts, newContact]); // Directly add the contact
    } else {
      alert("Contact already added!");
    }
  };

  // Handle clicking on a contact to create a chat room
  const handleContactClick = (contact) => {
    console.log("Contact clicked:", contact);
    setSelectedContact(contact);

    // Add the contact to the chat rooms list if not already present
    const isRoomAlreadyCreated = chatRooms.some((room) => room._id === contact._id);
    if (!isRoomAlreadyCreated) {
      setChatRooms((prevRooms) => [...prevRooms, contact]);
    }
  };

  // Handle closing the ChatPopup
  const handleCloseChatPopup = () => {
    setSelectedContact(null);
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging log
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
          <div className="chat-room-section">
            <h2>Chat Rooms</h2>
            <div className="room-list">
              {chatRooms.length === 0 ? (
                <p>No active chats. Click on a contact to start a chat!</p>
              ) : (
                chatRooms.map((room) => (
                  <button
                    key={room._id}
                    className="room-button"
                    onClick={() => setSelectedContact(room)}
                  >
                    <span className="text">{room.firstName}'s Room</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="contact-section">
            <ContactList contacts={contacts} onContactClick={handleContactClick} />
            <SearchContacts onSearch={handleSearchContacts} onAddContact={handleAddContact} />
          </div>
        </div>

        {selectedContact && (
          <ChatPopup contact={selectedContact} onClose={handleCloseChatPopup} />
        )}
      </div>
    </div>
  );
};

export default MainPage;