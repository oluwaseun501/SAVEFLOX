import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Download, Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";
import logo from "../assets/logo-text.png";

const LANGUAGES = [
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "pt", label: "Português",  flag: "🇧🇷" },
  { code: "hi", label: "हिन्दी",      flag: "🇮🇳" },
  { code: "id", label: "Indonesia",  flag: "🇮🇩" },
  { code: "ar", label: "العربية",     flag: "🇸🇦" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [installPrompt, setInstallPrompt] = useState(null);
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      alert("To install: open your browser menu → 'Add to Home Screen' / 'Install app'.");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const navLinks = [
    { key: "home",      path: "/" },
    { key: "tiktok",    path: "/tiktok-downloader" },
    { key: "twitter",   path: "/twitter-downloader" },
    { key: "instagram", path: "/instagram-downloader" },
    { key: "facebook",  path: "/facebook-downloader" },
    { key: "pinterest", path: "/pinterest-downloader" },
    { key: "mp3",       path: "/mp3-converter" },
    { key: "blog",      path: "/blog" },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    setLangOpen(false);
  };

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
          <li key={link.key}>
            <NavLink
              to={link.path}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={link.path === "/"}
            >
              {t(link.key)}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side - Desktop */}
      <div className="navbar-actions">
        <div className="navbar-lang-wrapper">
          <button
            className="navbar-lang-btn"
            onClick={() => setLangOpen(!langOpen)}
            aria-label={t("language")}
          >
            <Globe size={16} />
            <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
          </button>
          {langOpen && (
            <ul className="navbar-lang-dropdown">
              {LANGUAGES.map((lang) => (
                <li
                  key={lang.code}
                  className={lang.code === i18n.language ? "active" : ""}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span>{lang.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="navbar-download-btn" onClick={handleInstall}>
          <Download size={16} />
          {t("installApp")}
        </button>
        <button className="navbar-theme-toggle" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile Right Side */}
      <div className="navbar-mobile-right">
        <div className="navbar-lang-wrapper">
          <button
            className="navbar-lang-btn navbar-lang-btn-mobile"
            onClick={() => setLangOpen(!langOpen)}
            aria-label={t("language")}
          >
            <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
          </button>
          {langOpen && (
            <ul className="navbar-lang-dropdown navbar-lang-dropdown-mobile">
              {LANGUAGES.map((lang) => (
                <li
                  key={lang.code}
                  className={lang.code === i18n.language ? "active" : ""}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span>{lang.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

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

      {/* Mobile Dropdown Menu — always mounted, animates open/close */}
      <div
        className="navbar-mobile-menu"
        style={{
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: menuOpen ? "all" : "none",
          visibility: menuOpen ? "visible" : "hidden",
         transition: "opacity 0.55s ease, transform 0.55s ease, visibility 0.55s ease",
        }}
      >
        {navLinks.map((link, idx) => (
          <NavLink
            key={link.key}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(-10px)",
              transition: `opacity 0.45s ease ${idx * 80}ms, transform 0.8s ease ${idx * 80}ms`,
            }}
          >
            {t(link.key)}
          </NavLink>
        ))}

        {/* Mobile language picker */}
        <div
          className="mobile-lang-section"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateX(0)" : "translateX(-10px)",
            transition: `opacity 0.45s ease ${navLinks.length * 80}ms, transform 0.45s ease ${navLinks.length * 80}ms`,
          }}
        >
          <div className="mobile-lang-label">
            <Globe size={14} /> {t("language")}
          </div>
          <div className="mobile-lang-grid">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setMenuOpen(false); }}
                className={`mobile-lang-pill ${lang.code === i18n.language ? "active" : ""}`}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>



        <button
          className="navbar-download-btn mobile-full"
          onClick={handleInstall}
          style={{
            opacity: menuOpen ? 1 : 0,
           transition: `opacity 0.45s ease ${(navLinks.length + 1) * 80}ms`,
          }}
        >
          <Download size={16} />
          {t("installApp")}
        </button>
      </div>

    </nav>
  );
}