import React, { useState, useEffect, useContext, useCallback } from "react";
import socket from "../api/socket";
import MessageList from "./MessageList";
import "../styles/ChatPopup.css";
import AuthContext from "../context/AuthContext";
import apiClient from "../api/apiClient";

const ChatPopup = ({ contact, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useContext(AuthContext);

  const fetchMessages = useCallback(async () => {
    if (!user || !user.id) {
      console.error("User is not authenticated or user ID is undefined");
      return;
    }

    console.log(`Fetching messages for contact ID: ${contact._id} and user ID: ${user.id}`);

    try {
      const response = await apiClient.post("/api/messages/get-messages", {
        id: contact._id,
      });

      // Log the fetched messages and user ID for debugging
      console.log("Fetched messages:", response.data.messages);
      console.log("Current user ID:", user.id);

      // Ensure messages include _id and sender.id
      setMessages(response.data.messages);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [contact._id, user]);

  useEffect(() => {
    fetchMessages();

    const receiveMessageHandler = (message) => {
      console.log(`Received new message:`, message);
      if (message.sender.id === contact._id || message.recipient.id === user.id) {
        setMessages((prevMessages) => {
          // Check if the message already exists in the state (to avoid duplicates)
          const messageExists = prevMessages.some((msg) => msg._id === message._id);
          if (!messageExists) {
            // If the message is from the current user, replace the temporary message
            if (message.sender.id === user.id) {
              return prevMessages.map((msg) =>
                msg.tempId === message.tempId ? message : msg
              );
            }
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      console.log(`Cleaning up event listeners for contact ID: ${contact._id}`);
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [contact._id, user, fetchMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contact || !contact._id) {
      console.error("Contact ID is undefined");
      return;
    }
    if (newMessage.trim() && user && user.id) {
      console.log(`Sending message to contact ID: ${contact._id}`, newMessage);

      // Create a temporary message object
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        tempId: Date.now().toString(), // Track the temporary ID
        sender: { id: user.id }, // The current user's ID
        recipient: { id: contact._id }, // The recipient's ID
        content: newMessage, // The message content
        timestamp: new Date().toISOString(), // Current timestamp
      };

      // Update the messages state locally
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // Emit the message via Socket.IO
      socket.emit("sendMessage", {
        ...tempMessage, // Include tempId in the emitted message
      });

      // Clear the input field
      setNewMessage("");
    } else {
      console.error("User is not authenticated or message is empty");
    }
  };

  const handleDeleteMessage = async () => {
    const dmId = contact._id; // Use the contact's ID as the dmId
    console.log(`Deleting messages with DM ID: ${dmId}`);
    try {
      await apiClient.delete(`/api/contacts/delete-dm/${dmId}`);
      console.log("Messages deleted successfully");

      // Update the messages state locally by filtering out the deleted messages
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.sender.id !== dmId && msg.recipient.id !== dmId)
      );
    } catch (error) {
      console.error("Failed to delete messages:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  return (
    <div className="chat-popup-overlay">
      <div className="card-container">
        <div className="card-header">
          <div className="img-avatar"></div>
          <div className="text-chat">Chat with {contact.firstName}</div>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="card-body">
          <MessageList
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            user={user}
            contact={contact} // Pass the contact prop
          />
          <div className="message-input">
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Type your message here"
                className="message-send"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="button-send">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;