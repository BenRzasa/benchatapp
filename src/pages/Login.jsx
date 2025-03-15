import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password); // Call the login function from AuthContext
      console.log("Login successful, redirecting to /main"); // Log redirection
      navigate("/mainpage");
    } catch (error) {
      console.error("Login error:", error); // Log the error
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username" // Enable auto-fill for email
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" // Enable auto-fill for password
          required
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "#fff" }}>
        Don't have an account? <a href="/signup" style={{ color: "#00bcd4" }}>Sign up</a>
      </p>
    </div>
  );
};

export default Login;