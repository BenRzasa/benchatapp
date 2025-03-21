import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to Benchat!</h1>
      <div className="auth-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
      </div>
    </div>
  );
};

export default WelcomePage;