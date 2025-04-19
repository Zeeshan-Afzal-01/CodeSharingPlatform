import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [profilepic, setProfilepic] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState("");
    const [userId, setUserId] = useState("");

   
    const login = (token) => {
        localStorage.setItem("token", token);
        fetchUserData(token);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername("");
        setProfilepic("");
        setEmail("");
        setUserId("");
        setFullname("");
        localStorage.removeItem("token");
        navigate("/login");
    };

 
    const fetchUserData = async (token) => {
        try {
            const response = await api.get("/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.valid) {
                setIsLoggedIn(true);
                setUsername(response.data.username);
                setEmail(response.data.email);
                setProfilepic(response.data.profilePic);
                setFullname(response.data.fullname);
                setUserId(response.data.id);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Token validation failed:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

  
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            userId,
            fullname, 
            setFullname,
            email, 
            setEmail,
            isLoggedIn, 
            profilepic, 
            username, 
            login, 
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
