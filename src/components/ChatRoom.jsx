import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import socket from "../api/socket";
import "../styles/ChatRoom.css";

const ChatRoom = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Enable loading when entering the room

  useEffect(() => {
    // Fetch messages for the room
    socket.emit("joinRoom", { roomId });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsLoading(false); // Disable loading once messages are received
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        sender: user.id,
        recipient: roomId,
        content: newMessage,
        messageType: "text",
      });
      setNewMessage("");
    }
  };

  return (
    <div className="chat-room">
      <div className="header">
        <button onClick={() => navigate("/")}>Back</button>
        <h1>Chat Room</h1>
      </div>
      {isLoading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === user.id ? "sent" : "received"}`}>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      )}
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;