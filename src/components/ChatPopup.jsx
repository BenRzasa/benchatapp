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

    console.log(`Fetching messages for contact ID: ${contact._id} and user ID: ${user.id}`); // Use _id instead of id

    try {
      const response = await apiClient.post("/api/messages/get-messages", {
        id: contact._id, // Use _id instead of id
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [contact._id, user]); // Use _id instead of id

  useEffect(() => {
    fetchMessages();

    const receiveMessageHandler = (message) => {
      console.log(`Received new message:`, message);
      if (message.sender.id === contact._id || message.recipient.id === user.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      console.log(`Cleaning up event listeners for contact ID: ${contact._id}`); // Use _id instead of id
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [contact._id, user, fetchMessages]); // Use _id instead of id and include fetchMessages in dependencies

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contact || !contact._id) { // Use _id instead of id
      console.error("Contact ID is undefined");
      return;
    }
    if (newMessage.trim() && user && user.id) {
      console.log(`Sending message to contact ID: ${contact._id}`, newMessage); // Use _id instead of id
      socket.emit("sendMessage", {
        sender: user.id, // The current user's ID
        recipient: contact._id, // Use _id instead of id
        content: newMessage, // The message content
      });

      // Fetch messages again after sending a message
      fetchMessages();

      setNewMessage("");
    } else {
      console.error("User is not authenticated or message is empty");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    console.log(`Deleting message with ID: ${messageId}`);
    try {
      await apiClient.delete(`/api/contacts/delete-dm/${messageId}`);
      console.log("Message deleted successfully");
      // Fetch messages again after deleting a message
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete message:", error);
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
          <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} user={user} />
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