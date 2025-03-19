import React from "react";

const Message = ({ message, onDeleteMessage }) => {
  return (
    <div className="message-bubble">
      <div className="message-content">
        <p>{message.content}</p>
        <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
      </div>
      <button className="close-button" onClick={() => onDeleteMessage(message.id)}>
        &times;
      </button>
    </div>
  );
};

export default Message;