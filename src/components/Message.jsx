import React from "react";

const Message = ({ message }) => {
  return (
    <div className="message">
      <p>{message.content}</p>
      <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
    </div>
  );
};

export default Message;