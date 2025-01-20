import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Navbar = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext); // Access AuthContext
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleCheckLogin = (e) => {
    e.preventDefault(); // Prevent default behavior of <a> tag
    if (isLoggedIn) {
      navigate("/dashboard"); // Navigate to dashboard if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          CodeShare
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a onClick={handleCheckLogin} className="nav-link" href="/">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#howItWorks">
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#pricing">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonials">
                Testimonials
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
          </ul>
          <div className="d-flex">
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {username}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <a className="dropdown-item" onClick={handleCheckLogin} href="/">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/profile">
                      Profile
                    </a>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <a href="/login">
                  <button className="btn btn-secondary me-2">Login</button>
                </a>
                <a href="/register">
                  <button className="btn btn-primary">Sign Up</button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
