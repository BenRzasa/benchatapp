import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../api/socket";

const RoomPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for the room
    socket.emit("getMessages", { roomId });

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", { roomId, content: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="room-page">
      <h2>Room: {roomId}</h2>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default RoomPage;