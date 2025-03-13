import React, { useState, useEffect } from "react";
import socket from "../api/socket";
import Message from "../components/Message";
import ChatRoomList from "../components/ChatRoomList"; // Ensure this is used
import "../styles/ChatRoom.css";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeRoom, setActiveRoom] = useState(null); // Track the active chat room

  // Join a chat room when activeRoom changes
  useEffect(() => {
    if (activeRoom) {
      socket.emit("joinRoom", activeRoom.id);
      setMessages([]); // Clear messages when switching rooms
    }
  }, [activeRoom]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send a message to the active room
  const sendMessage = () => {
    if (input.trim() && activeRoom) {
      socket.emit("sendMessage", { roomId: activeRoom.id, content: input });
      setInput("");
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-room-list">
        {/* Use the ChatRoomList component */}
        <ChatRoomList onRoomSelect={setActiveRoom} />
      </div>
      <div className="chat-window">
        {activeRoom ? (
          <>
            <div className="messages">
              {messages.map((msg, index) => (
                <Message key={index} message={msg} />
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-room-selected">
            <p>Please select a chat room to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;