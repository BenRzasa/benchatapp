import React from "react";

const ChatRoomList = ({ chatRooms, onEnterRoom, isLoading, error }) => {
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
            <li key={room.id} onClick={() => onEnterRoom(room.id)}>
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoomList;