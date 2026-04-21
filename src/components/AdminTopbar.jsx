import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, ChevronDown, ExternalLink, LogOut, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/AdminTopbar.css";


export default function AdminTopbar({ email = "admin@saveflux.com" }) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sf_admin");
    navigate("/admin/login");
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-spacer" />

      <div className="admin-topbar-actions">
        <button
          className="admin-topbar-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="admin-topbar-user">
          <button className="admin-topbar-user-btn">
            <div className="admin-topbar-avatar">
              <User size={16} />
            </div>
            <div className="admin-topbar-user-info">
              <span className="admin-topbar-user-name">Admin</span>
              <span className="admin-topbar-user-email">{email}</span>
            </div>
            <ChevronDown size={16} className="admin-topbar-chevron" />
          </button>

          <div className="admin-topbar-dropdown">
            <div className="admin-topbar-dropdown-header">
              <div className="admin-topbar-dropdown-name">Signed in as</div>
              <div className="admin-topbar-dropdown-email">{email}</div>
            </div>
            <Link to="/" className="admin-topbar-dropdown-item">
              <ExternalLink size={15} />
              View Site
            </Link>
            <button
              className="admin-topbar-dropdown-item danger"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}