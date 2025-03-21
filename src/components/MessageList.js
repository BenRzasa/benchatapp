import React from "react";
import "../styles/MessageList.css";

const MessageList = ({ messages, onDeleteMessage, user, contact }) => {
  if (!contact) {
    console.error("Contact is undefined");
    return null; // Or render a fallback UI
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message._id} // Use _id as the key
          className={`message-bubble ${
            message.sender.id === user.id ? "sent" : "received"
          }`}
        >
          <div className="message-content">{message.content}</div>
          {message.sender.id === user.id && ( // Only show delete button for messages sent by the current user
            <button
              className="delete-button"
              onClick={() => onDeleteMessage(contact._id)} // Use contact._id
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;