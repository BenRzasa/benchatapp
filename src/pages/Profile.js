import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import "../styles/Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/auth/userinfo");
        if (response.data) {
          setFirstName(response.data.firstName || "");
          setLastName(response.data.lastName || "");
          setColor(response.data.color || "");
          console.log("Fetched user data successfully")
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { firstName, lastName, color };

      console.log("Sending request body:", updatedUser); // Log the request body

      const response = await apiClient.post("/api/auth/update-profile", updatedUser);

      console.log("Received response:", response.data); // Log the response

      if (response.data) {
        await updateUser(response.data.user);
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
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Favorite Color (e.g., #ff5733)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;