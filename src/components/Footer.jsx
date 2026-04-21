import { FaTwitter, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import "../styles/Footer.css";

export default function Footer() {
  const sections = [
    {
      title: "Downloaders",
      links: [
        "TikTok Downloader",
        "Twitter Downloader",
        "Instagram Downloader",
        "Facebook Downloader",
      ],
    },
    {
      title: "Tools",
      links: ["Video Editor", "MP3 Converter", "Video Trimmer", "Video Cropper"],
    },
    {
      title: "Legal",
      links: [
        "Terms of Service",
        "Privacy Policy",
        "Copyright Information",
        "Contact Us",
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">SF</span>
              <span className="footer-logo-text">
                Save<span>Flux</span>
              </span>
            </div>
            <p className="footer-tagline">
              The ultimate tool to download videos and audio from your favorite
              social media platforms. Fast, free, and secure.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter" className="footer-social">
                <FaTwitter size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="footer-social">
                <FaInstagram size={14} />
              </a>
              <a href="#" aria-label="Facebook" className="footer-social">
                <FaFacebookF size={14} />
              </a>
              <a href="#" aria-label="TikTok" className="footer-social">
                <FaTiktok size={14} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section, idx) => (
            <div className="footer-column" key={idx}>
              <h4 className="footer-column-title">{section.title}</h4>
              <ul className="footer-links">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>© 2026 SaveFlux. All rights reserved.</p>
          <p>SaveFlux does not host any pirated or copyright content on its server.</p>
        </div>
      </div>
    </footer>
  );
}