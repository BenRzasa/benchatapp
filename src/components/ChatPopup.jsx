import React, { useState, useEffect } from "react";
import socket from "../api/socket";
import "../styles/ChatPopup.css";
import MessageList from "./MessageList"; // Import MessageList component

const ChatPopup = ({ contact, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for the selected contact
    socket.emit("getMessages", { contactId: contact.id });

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message.sender.id === contact.id || message.recipient.id === contact.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [contact.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("sendMessage", { recipientId: contact.id, content: newMessage });
      setNewMessage("");
      console.log(`Message sent to ${contact.firstName}: ${newMessage}`); // Console confirmation
    }
  };

  const handleDeleteMessage = (messageId) => {
    socket.emit("deleteMessage", { messageId });
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
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
          <div className="messages-container">
            <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} />
          </div>
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