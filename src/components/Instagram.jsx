import { useState } from "react";
import { Download, Link, Video } from "lucide-react";
import "../styles/Instagram.css";

export default function Instagram() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");

  const handleDownload = () => {
    if (!url) return;
    console.log("Instagram Download URL:", url, "Quality:", quality);
  };

  return (
    <section className="instagram">
      <div className="instagram-content">
        {/* Icon */}
        <div className="instagram-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="instagram-heading">
          Download <span>Instagram</span> Videos
        </h1>

        {/* Subtext */}
        <p className="instagram-subtext">
          Download Instagram Reels, IGTV, Photos, and Videos easily and for free.
        </p>

        {/* Downloader Card */}
        <div className="instagram-card">
          <div className="instagram-input-group">
            <div className="instagram-input-wrapper">
              <Link size={18} className="instagram-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Instagram link here..."
                className="instagram-input"
              />
            </div>
            <button className="instagram-btn" onClick={handleDownload}>
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="instagram-options">
            <span className="instagram-options-label">Options:</span>

            <button className="instagram-option-pill active">
              <Video size={14} />
              Video (MP4)
            </button>

            <select
              className="instagram-quality-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option>4K Ultra HD</option>
              <option>1080p HD</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}