import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/header/navbar";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Dashboard from "./components/dashboard/dashboard";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Footer from "./components/footer/footer";
import LandingPage from "./components/landingPage/landingPage";
import OtpVerify from "./components/auth/otpVerify";
import Sidebar from "./components/sidebar/sidebar";
import TeamOverview from "./components/teams/teamOverview";
import Profile from "./components/profile/Profile";
import Search from "./components/search/Search";
import Messaging from "./components/messaging/Messaging";
import Meetings from "./components/meetings/Meetings";
import CodeEditor from "./components/codeSnippets/CodeEditor";
import { Toaster } from 'react-hot-toast';

function Layout() {
  const location = useLocation();
  
  const showNavbarRoutes = ["/", "/register", "/login", "/otp-verify"];
  const showSidebarRoutes = ["/dashboard", "/teams", "/profile", "/search", "/messages", "/meetings", "/code-editor"];
  
  // Determine if navbar/footer should be shown
  const hasNavbar = showNavbarRoutes.includes(location.pathname);
  
  return (
    <div className={`app-container ${hasNavbar ? 'route-with-nav' : ''}`}>
      {hasNavbar && <Navbar />}

      <div className={`main-content ${showSidebarRoutes.includes(location.pathname) ? 'sidebar-show' : ''}`}>
        {showSidebarRoutes.includes(location.pathname) && <Sidebar />}

        <div className="content-area">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<TeamOverview/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp-verify" element={<OtpVerify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/code-editor" element={<CodeEditor />} />
            <Route path="*" element={<div>404 - Page not found. Current path: {location.pathname}</div>} />
          </Routes>
        </div>
      </div>

      {hasNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;