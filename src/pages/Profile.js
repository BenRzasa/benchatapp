import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import "../styles/Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth(); // Destructure updateUser
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        throw new Error("User ID is missing. Please log in again.");
      }

      const updatedUser = {
        firstName,
        lastName,
        profileSetup: true, // Set profileSetup to true
      };

      console.log("Sending request body:", updatedUser); // Log the request body

      const response = await apiClient.post("/api/auth/update-profile", updatedUser);

      console.log("Received response:", response.data); // Log the response

      if (response.data) {
        // Update the user in the AuthContext
        await updateUser(response.data);
        alert("Profile updated successfully!");
        navigate("/mainpage");
      } else {
        throw new Error("Profile update failed: Invalid response");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">
        {firstName} {lastName}'s Profile
      </h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;