import { useState } from "react";
import { Download, Link, Video } from "lucide-react";
import "../styles/Facebook.css";

export default function Facebook() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");

  const handleDownload = () => {
    if (!url) return;
    console.log("Facebook Download URL:", url, "Quality:", quality);
  };

  return (
    <section className="facebook">
      <div className="facebook-content">
        {/* Icon */}
        <div className="facebook-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="facebook-heading">
          Download <span>Facebook</span> Videos
        </h1>

        {/* Subtext */}
        <p className="facebook-subtext">
          Save Facebook videos, reels, and stories directly to your device in HD.
        </p>

        {/* Downloader Card */}
        <div className="facebook-card">
          <div className="facebook-input-group">
            <div className="facebook-input-wrapper">
              <Link size={18} className="facebook-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Facebook video link here..."
                className="facebook-input"
              />
            </div>
            <button className="facebook-btn" onClick={handleDownload}>
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="facebook-options">
            <span className="facebook-options-label">Options:</span>

            <button className="facebook-option-pill active">
              <Video size={14} />
              Video (MP4)
            </button>

            <select
              className="facebook-quality-select"
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