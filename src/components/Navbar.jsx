import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Download, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";
import logo from "../assets/logo-text.png";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "TikTok", path: "/tiktok-downloader" },
    { name: "Twitter", path: "/twitter-downloader" },
    { name: "Instagram", path: "/instagram-downloader" },
    { name: "Facebook", path: "/facebook-downloader" },
    { name: "Mp3 Converter", path: "/mp3-converter" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="SaveFlux" className="navbar-logo-img" />
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.name}>
            <NavLink
              to={link.path}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={link.path === "/"}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side - Desktop */}
      <div className="navbar-actions">
        <button className="navbar-download-btn">
          <Download size={16} />
          Get App
        </button>
        <button className="navbar-theme-toggle" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile Right Side */}
      <div className="navbar-mobile-right">
        <button className="navbar-theme-toggle" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.name}
            </NavLink>
          ))}
          <button className="navbar-download-btn mobile-full">
            <Download size={16} />
            Get App
          </button>
        </div>
      )}
    </nav>
  );
}