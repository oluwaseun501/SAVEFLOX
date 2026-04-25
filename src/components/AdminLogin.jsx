import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn } from "lucide-react";
import "../styles/AdminLogin.css";
import { login } from "../utils/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo only — replace with real auth later
    if (email === "admin@saveflux.com" && password === "admin123") {
      login();
      navigate("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="admin-login">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-icon">
          <Lock size={26} />
        </div>
        <h1 className="admin-login-title">SaveFlux Admin</h1>
        <p className="admin-login-subtitle">Sign in to manage your dashboard</p>

        <div className="admin-login-field">
          <Mail size={16} className="admin-login-field-icon" />
          <input
            type="email"
            placeholder="admin@saveflux.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="admin-login-field">
          <Lock size={16} className="admin-login-field-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <button type="submit" className="admin-login-btn">
          <LogIn size={16} />
          Sign In
        </button>
      </form>
    </section>
  );
}