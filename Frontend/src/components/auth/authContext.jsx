import React, { createContext, useState, useEffect } from "react";
import {jwtDecode as decode} from "jwt-decode"; // Import jwt-decode to decode tokens
import {  useNavigate } from "react-router-dom";
// Create Auth Context
export const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
    const navigate=useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [username, setUsername] = useState(""); // Store username

  // Login function to update state
  const login = (user, token) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem("token", token); // Save token to localStorage
  };

  // Logout function to reset state
  const logout = () => {
    setIsLoggedIn(false);
    navigate("/login")
    setUsername("");
    localStorage.removeItem("token"); // Remove token
  };

  // Check for token in localStorage and log in user automatically
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decode(token); // Decode token
        
        if (decoded && decoded.username) {
          setIsLoggedIn(true);
          setUsername(decoded.username); // Set username from token
        } else {
          logout(); // Invalid token
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
        logout(); // Invalid token
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
