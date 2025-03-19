import React from "react";
import { useNavigate } from "react-router-dom";

const ChatRoomList = ({ chatRooms, onEnterRoom, isLoading, error }) => {
  const navigate = useNavigate();

  return (
    <div className="chat-room-list">
      <h2>Chat Rooms</h2>
      {error && <p className="error-message">{error}</p>}
      {chatRooms.length === 0 && !isLoading && (
        <p>No chat rooms. Create one below:</p>
      )}
      <div className="scrollable-list">
        <ul>
          {chatRooms.map((room) => (
            <li key={room.id} onClick={() => navigate(`/chat-room/${room.id}`)}>
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoomList;