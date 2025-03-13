import React, { useState, useContext } from "react";
import apiClient from "../api/apiClient";
import AuthContext from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/auth/update-profile", { firstName, lastName, color });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Favorite Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;