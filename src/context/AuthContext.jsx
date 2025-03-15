import React, { createContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for a stored token on initial load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch user data using the token
      fetchUserData(token);
    }
  }, []);

  // Fetch user data using the token
  const fetchUserData = async (token) => {
    try {
      const response = await apiClient.get("/api/auth/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout(); // Clear invalid token
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Set the user in state
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout function
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");

    // Clear the user from state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;