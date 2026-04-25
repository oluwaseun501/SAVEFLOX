import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Download,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import "../styles/AdminSidebar.css";
import logo from "../assets/logo-text.png";

const menu = [
  { name: "Dashboard",     icon: LayoutDashboard, path: "/admin" },
  { name: "Analytics",     icon: BarChart3,       path: "/admin/analytics" },
  { name: "Downloads Log", icon: Download,        path: "/admin/downloads" },
  { name: "Blog Posts",    icon: FileText,        path: "/admin/blog" },
  { name: "Settings",      icon: Settings,        path: "/admin/settings" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger button (only visible < 640px) */}
      <button
        className="admin-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="admin-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-brand">
          <img src={logo} alt="SaveFlux" className="admin-brand-logo" />
          <span className="admin-brand-badge">Admin</span>

          {/* Close button (only visible inside open mobile drawer) */}
          <button
            className="admin-sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-menu">
          {menu.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `admin-menu-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}