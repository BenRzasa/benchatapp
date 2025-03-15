import React, { createContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user info on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/api/auth/userinfo");
        if (response.data) {
          setUser(response.data); // Set the user state if the user is authenticated
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // User is not logged in, clear the user state
          setUser(null);
        } else {
          console.error("Failed to fetch user info:", error);
        }
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", { email, password });
      setUser(response.data.user); // Update the user state with the response
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Persist user state
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error to the caller
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      setUser(null); // Clear the user state
      localStorage.removeItem("user"); // Remove user state from localStorage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Update profile function
  const updateProfile = async (firstName, lastName, color) => {
    try {
      const response = await apiClient.post("/api/auth/update-profile", {
        firstName,
        lastName,
        color,
      });
      setUser(response.data.user); // Update the user state with the new profile data
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Persist updated user state
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error; // Propagate the error to the caller
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;