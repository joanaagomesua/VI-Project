import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="navbar">
      <div className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </div>
      <div className="navbar-menu" onClick={toggleSidebar}>
        <FaBars alt="Menu" />
      </div>

      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-title">
        <Link to="/">
          <p>CineStats</p>
        </Link>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="close-btn">
        <FaTimes size={20} onClick={toggleSidebar}></FaTimes>
          
        </div>
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>General Stats</Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSidebar}>Map Stats</Link>
          </li>
          <li>
            <Link to="/aboutus" onClick={toggleSidebar}>About Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
