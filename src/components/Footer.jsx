import { FaTwitter, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";
import logo from "../assets/logo.png";


const WHATSAPP_NUMBER = "1234567890"; // <-- replace with your number, no "+" or spaces

export default function Footer() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("footer_downloaders"),
      links: [
        { label: t("footer_tiktok_dl"),    to: "/tiktok-downloader" },
        { label: t("footer_twitter_dl"),   to: "/twitter-downloader" },
        { label: t("footer_instagram_dl"), to: "/instagram-downloader" },
        { label: t("footer_facebook_dl"),  to: "/facebook-downloader" },
      ],
    },
    {
      title: t("footer_tools"),
      links: [
        { label: t("footer_video_downloader"), to: "/" },
        { label: t("footer_mp3_converter"),    to: "/mp3-converter" },
        { label: t("footer_change_voice"),     to: "/mp3-converter" },
        { label: t("footer_edit_voice"),       to: "/mp3-converter" },
      ],
    },
    {
      title: t("footer_legal"),
      links: [
        { label: t("footer_terms"),          to: "/terms" },
        { label: t("footer_privacy"),        to: "/privacy" },
        { label: t("footer_copyright_info"), to: "/copyright" },
        {
          label: t("footer_contact"),
          href: `https://wa.me/${WHATSAPP_NUMBER}`,
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
             <Link to="/">
          <img src={logo} alt="SaveFlux" className="navbar-logo-img" />
        </Link>
              <span className="footer-logo-text">
                Save<span>Flox</span>
              </span>
            </div>
            <p className="footer-tagline">{t("footer_tagline")}</p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter" className="footer-social"><FaTwitter size={14} /></a>
              <a href="#" aria-label="Instagram" className="footer-social"><FaInstagram size={14} /></a>
              <a href="#" aria-label="Facebook" className="footer-social"><FaFacebookF size={14} /></a>
              <a href="#" aria-label="TikTok" className="footer-social"><FaTiktok size={14} /></a>
            </div>
          </div>

          {sections.map((section, idx) => (
            <div className="footer-column" key={idx}>
              <h4 className="footer-column-title">{section.title}</h4>
              <ul className="footer-links">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>{t("footer_copyright")}</p>
          <p>{t("footer_disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}