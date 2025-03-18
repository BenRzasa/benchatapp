import React, { useState } from "react";
import socket from "../api/socket";

const SendMessage = ({ contactId }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { recipientId: contactId, content: message });
      setMessage("");
    }
  };

  return (
    <div className="send-message">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default SendMessage;