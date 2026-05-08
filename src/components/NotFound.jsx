import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-shell">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-subtitle">
          The page you are looking for is not available, has been moved, or no longer exists.
          Go back to the home page to explore more downloaders and tools.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn-primary">
            <Home size={16} />
            Go to Home
          </Link>
          <button
            type="button"
            className="nf-btn nf-btn-secondary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        <div className="nf-suggestions">
          <p className="nf-suggestions-label">
            <Search size={14} /> You might be looking for:
          </p>
          <div className="nf-suggestions-grid">
            <Link to="/tiktok-downloader">TikTok Downloader</Link>
            <Link to="/instagram-downloader">Instagram Downloader</Link>
            <Link to="/facebook-downloader">Facebook Downloader</Link>
            <Link to="/twitter-downloader">Twitter Downloader</Link>
            <Link to="/pinterest-downloader">Pinterest Downloader</Link>
            <Link to="/mp3-converter">MP3 Converter</Link>
            <Link to="/blog">Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}