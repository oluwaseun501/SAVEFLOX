import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun, Moon, ChevronDown, ExternalLink, LogOut, User,
  X, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/AdminTopbar.css";
import { logout, setToken } from "../utils/auth";
import { authAPI } from "../services/api";

const PASSWORD_KEY = "sf_admin_password";
const DEFAULT_PASSWORD = "admin123";

export default function AdminTopbar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    // Fetch email from API on mount
    authAPI
      .getProfile()
      .then((res) => {
        if (res.data?.success && res.data?.user?.email) {
          setEmail(res.data.user.email);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
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
                <span className="admin-topbar-user-email">{loading ? "Loading..." : email}</span>
              </div>
              <ChevronDown size={16} className="admin-topbar-chevron" />
            </button>

            <div className="admin-topbar-dropdown">
              <div className="admin-topbar-dropdown-header">
                <div className="admin-topbar-dropdown-name">Signed in as</div>
                <div className="admin-topbar-dropdown-email">{loading ? "Loading..." : email}</div>
              </div>

              <button
                className="admin-topbar-dropdown-item"
                onClick={() => setProfileOpen(true)}
              >
                <User size={15} />
                Profile settings
              </button>

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

      {profileOpen && (
        <ProfileModal
          currentEmail={email}
          onClose={() => setProfileOpen(false)}
          onEmailChange={(newEmail) => setEmail(newEmail)}
        />
      )}
    </>
  );
}

/* ----------------------------- Modal ----------------------------- */
function ProfileModal({ currentEmail, onClose, onEmailChange }) {
  const [tab, setTab] = useState("email");

  /* Email form */
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [emailPwd, setEmailPwd] = useState("");
  const [showEmailPwd, setShowEmailPwd] = useState(false);
  const [emailMsg, setEmailMsg] = useState(null); // { type: "success"|"error", text }

  /* Password form */
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const saveEmail = (e) => {
    e.preventDefault();
    setEmailMsg(null);

    const trimmed = newEmail.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!validEmail) {
      setEmailMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (!emailPwd) {
      setEmailMsg({ type: "error", text: "Current password is required to confirm changes." });
      return;
    }
    if (trimmed === currentEmail) {
      setEmailMsg({ type: "error", text: "New email is the same as the current one." });
      return;
    }

    // Call backend to persist change
    authAPI.updateEmail(trimmed, emailPwd)
      .then((res) => {
        const data = res.data || {};
        if (data.success) {
          // Update token if provided
          if (data.token) setToken(data.token);
          onEmailChange(trimmed);
          setEmailPwd("");
          setEmailMsg({ type: "success", text: "Email updated successfully." });
        } else {
          setEmailMsg({ type: "error", text: data.error || "Failed to update email." });
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err.message || "Failed to update email.";
        setEmailMsg({ type: "error", text: msg });
      });
  };

  const savePassword = (e) => {
    e.preventDefault();
    setPwdMsg(null);

    // Get stored password from localStorage for local verification only
    const storedPwd = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;

    if (currentPwd !== storedPwd) {
      setPwdMsg({ type: "error", text: "Current password is incorrect." });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPwd === currentPwd) {
      setPwdMsg({ type: "error", text: "New password must be different from the current one." });
      return;
    }

    // Call backend to change password
    authAPI.changePassword(currentPwd, newPwd, confirmPwd)
      .then((res) => {
        const data = res.data || {};
        if (data.success) {
          localStorage.setItem(PASSWORD_KEY, newPwd);
          setCurrentPwd("");
          setNewPwd("");
          setConfirmPwd("");
          setPwdMsg({ type: "success", text: "Password updated successfully." });
        } else {
          setPwdMsg({ type: "error", text: data.error || "Failed to update password." });
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err.message || "Failed to update password.";
        setPwdMsg({ type: "error", text: msg });
      });
  };

  return (
    <div className="adt-modal-backdrop" onClick={onClose}>
      <div className="adt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adt-modal-header">
          <h2>Profile settings</h2>
          <button className="adt-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="adt-tabs">
          <button
            className={`adt-tab ${tab === "email" ? "active" : ""}`}
            onClick={() => setTab("email")}
          >
            <Mail size={15} /> Email
          </button>
          <button
            className={`adt-tab ${tab === "password" ? "active" : ""}`}
            onClick={() => setTab("password")}
          >
            <Lock size={15} /> Password
          </button>
        </div>

        <div className="adt-modal-body">
          {tab === "email" && (
            <form className="adt-form" onSubmit={saveEmail}>
              <label>
                Current email
                <input type="email" value={currentEmail} disabled />
              </label>

              <label>
                New email <span className="adt-required">*</span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Confirm with current password <span className="adt-required">*</span>
                <div className="adt-input-wrap">
                  <input
                    type={showEmailPwd ? "text" : "password"}
                    value={emailPwd}
                    onChange={(e) => setEmailPwd(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="adt-eye"
                    onClick={() => setShowEmailPwd((s) => !s)}
                    aria-label={showEmailPwd ? "Hide password" : "Show password"}
                  >
                    {showEmailPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {emailMsg && (
                <div className={`adt-msg ${emailMsg.type}`}>
                  {emailMsg.type === "success"
                    ? <CheckCircle2 size={15} />
                    : <AlertCircle size={15} />}
                  {emailMsg.text}
                </div>
              )}

              <div className="adt-form-actions">
                <button type="button" className="adt-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="adt-btn-primary">
                  Update email
                </button>
              </div>
            </form>
          )}

          {tab === "password" && (
            <form className="adt-form" onSubmit={savePassword}>
              <label>
                Current password <span className="adt-required">*</span>
                <div className="adt-input-wrap">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="adt-eye"
                    onClick={() => setShowCurrent((s) => !s)}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label>
                New password <span className="adt-required">*</span>
                <div className="adt-input-wrap">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="adt-eye"
                    onClick={() => setShowNew((s) => !s)}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label>
                Confirm new password <span className="adt-required">*</span>
                <div className="adt-input-wrap">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="adt-eye"
                    onClick={() => setShowConfirm((s) => !s)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {pwdMsg && (
                <div className={`adt-msg ${pwdMsg.type}`}>
                  {pwdMsg.type === "success"
                    ? <CheckCircle2 size={15} />
                    : <AlertCircle size={15} />}
                  {pwdMsg.text}
                </div>
              )}

              <div className="adt-form-actions">
                <button type="button" className="adt-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="adt-btn-primary">
                  Update password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}