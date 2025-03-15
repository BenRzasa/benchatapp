import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import apiClient from "../api/apiClient";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/auth/update-profile", {
        firstName,
        lastName,
        bio,
        profilePicture,
      });
      alert("Profile updated successfully!");
      navigate("/mainpage"); // Redirect to main page after saving
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Update profile picture state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      {/* Add the header here */}
      <h1 className="profile-header">
        {firstName} {lastName}'s Profile
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="profile-picture">
          <img
            src={profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>
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
        <textarea
          placeholder="About Me"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;