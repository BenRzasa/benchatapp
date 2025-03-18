import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset state when the component mounts
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password); // Call the login function from AuthContext
      navigate("/mainpage"); // Redirect to the main page after successful login
    } catch (error) {
      console.error("Login error:", error);
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
          autoComplete="username"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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