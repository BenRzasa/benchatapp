import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data after login
  const fetchUserData = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/auth/userinfo");
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate the token and fetch user data on initial load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", { email, password });
      if (response.data) {
        // After successful login, fetch user data
        await fetchUserData();
      } else {
        throw new Error("Login failed: Invalid response");
      }
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

  // Function to update user data
  const updateUser = useCallback(async (updatedUserData) => {
    try {
      // Update the user state
      setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;