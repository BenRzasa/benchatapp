import React from "react";

const MessageList = ({ messages, onDeleteMessage }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <p>{message.content}</p>
          <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default MessageList;