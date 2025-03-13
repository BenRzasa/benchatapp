import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the main page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/chat" className="nav-link">
          Chat Rooms
        </Link>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;