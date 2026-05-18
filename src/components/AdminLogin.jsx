import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn } from "lucide-react";
import "../styles/AdminLogin.css";
import { authAPI } from "../services/api";
import { login, isAuthenticated } from "../utils/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const token = response?.data?.token;
      if (!token) {
        throw new Error("Login failed. No token returned.");
      }
      login(token);
      navigate("/admin");
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Invalid email or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to admin if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, []);

  return (
    <section className="admin-login">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-icon">
          <Lock size={26} />
        </div>
        <h1 className="admin-login-title">Saveflox Admin</h1>
        <p className="admin-login-subtitle">Sign in to manage your dashboard</p>

        <div className="admin-login-field">
          <Mail size={16} className="admin-login-field-icon" />
          <input
            type="email"
            placeholder="admin@Saveflox.com"
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

        <button type="submit" className="admin-login-btn" disabled={loading}>
          <LogIn size={16} />
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}