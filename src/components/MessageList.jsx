import React from "react";
import "../styles/MessageList.css"; // Import the CSS file for styling

const MessageList = ({ messages, onDeleteMessage, user }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-bubble ${
            message.sender.id === user.id ? "sent" : "received"
          }`}
        >
          <div className="message-content">{message.content}</div>
          <button className="delete-button" onClick={() => onDeleteMessage(message.id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessageList;