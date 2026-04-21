import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import "../styles/AdminSidebar.css";
import logo from "../assets/logo-text.png";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Downloads Log", icon: Download, path: "/admin/downloads" },
  { name: "Blog Posts", icon: FileText, path: "/admin/blog" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <img src={logo} alt="SaveFlux" className="admin-brand-logo" />
        <span className="admin-brand-badge">Admin</span>
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
  );
}