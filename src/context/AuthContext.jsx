// AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/auth/userinfo");
      if (response.data && response.data.user) {
        console.log("Token validation successful:", response.data.user);
        setUser(response.data.user);
      } else {
        console.error("Token validation failed: User data is missing");
        setUser(null);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for a valid session on initial load
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", { email, password });
      const { user } = response.data;

      // Set the user in state
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      setUser(null); // Clear the user state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;