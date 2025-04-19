import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { loading, profilepic, username, email, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const path = location.pathname.split("/")[1];
  
  const sidebarItems = [
    { name: "Dashboard", path: "dashboard", icon: "fa-tachometer-alt" },
    { name: "Profile", path: "profile", icon: "fa-user" },
    { name: "Search", path: "search", icon: "fa-search" },
    { name: "Teams", path: "teams", icon: "fa-users" },
    { name: "Code Snippets", path: "code-snippets", icon: "fa-code" },
    { name: "Messages", path: "messages", icon: "fa-comments" },
    { name: "Meetings", path: "meetings", icon: "fa-calendar-alt" }
  ];

  return (
    <>
      <button
        className="btn btn-primary sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <FaChevronRight size={20} />
      </button>

      <nav id="sidebar" className={`sidebar bg-white border-end ${isOpen ? "show" : ""}`}>
        <div className="d-flex flex-column h-100">
          <div className="px-3 py-4 border-bottom">
            <div className="d-flex align-items-center">
              <svg className="bi me-2 text-primary" width="30" height="30" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"></path>
              </svg>
              <Link to="/" className="fw-bold text-dark" style={{ textDecoration: "none" }}>CodeShare</Link>
            </div>
          </div>

          <ul className="nav flex-column mt-3">
            {sidebarItems.map((item) => (
              <li className="nav-item mt-2" key={item.name}>
                <Link
                  to={`/${item.path}`}
                  className={`nav-link ${path === item.path ? "active text-primary" : "text-dark"}`}
                >
                  <i className={`fas ${item.icon} me-2`}></i> 
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-top p-3 text-center">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "60px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Dropdown>
                <Dropdown.Toggle variant="light" className="d-flex align-items-center w-100 border-0">
                  <img className="rounded-circle me-2" width="40" height="40" src={`http://localhost:3002/${profilepic}`} alt="User profile" />
                  <div className="me-auto">
                    <p className="mb-0 fw-medium">{username}</p>
                    <p className="small text-muted">{email}</p>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  <Dropdown.Item as={Link} to="/dashboard">
                    <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="fas fa-user me-2"></i> Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </nav>

      {isOpen && <div className="sidebar-overlay d-lg-none" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
