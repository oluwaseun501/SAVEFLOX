import { FaTwitter, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("footer_downloaders"),
      links: [
        t("footer_tiktok_dl"),
        t("footer_twitter_dl"),
        t("footer_instagram_dl"),
        t("footer_facebook_dl"),
      ],
    },
    {
      title: t("footer_tools"),
      links: [
        t("footer_video_editor"),
        t("footer_mp3_converter"),
        t("footer_video_trimmer"),
        t("footer_video_cropper"),
      ],
    },
    {
      title: t("footer_legal"),
      links: [
        t("footer_terms"),
        t("footer_privacy"),
        t("footer_copyright_info"),
        t("footer_contact"),
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">SF</span>
              <span className="footer-logo-text">
                Save<span>Flux</span>
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
                  <li key={i}><a href="#">{link}</a></li>
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