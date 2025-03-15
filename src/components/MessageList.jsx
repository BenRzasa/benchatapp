import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";

const MessageList = ({ roomId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("getMessages", { roomId });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;