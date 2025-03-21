import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../styles/Signup.css";
import DOMPurify from "dompurify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Sanitize inputs
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);
    const sanitizedConfirmPassword = DOMPurify.sanitize(confirmPassword);
  
    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      await apiClient.post("/api/auth/signup", {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Missing email or password.");
            break;
          case 409:
            setError("The email is already in use.");
            break;
          default:
            setError("Signup failed. Please try again.");
        }
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  }; 

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Signup</button>
        <button type="button" onClick={handleBackToHome} className="back-button">
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default Signup;