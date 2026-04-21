import { useState } from "react";
import { Download, Link, Video } from "lucide-react";
import "../styles/Twitter.css";

export default function Twitter() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");

  const handleDownload = () => {
    if (!url) return;
    console.log("Twitter Download URL:", url, "Quality:", quality);
  };

  return (
    <section className="twitter">
      <div className="twitter-content">
        {/* Icon */}
        <div className="twitter-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="twitter-heading">
          Download <span>Twitter</span> Videos
        </h1>

        {/* Subtext */}
        <p className="twitter-subtext">
          Download Twitter (X) videos and GIFs in HD quality. Fast, free, and
          no watermark.
        </p>

        {/* Downloader Card */}
        <div className="twitter-card">
          <div className="twitter-input-group">
            <div className="twitter-input-wrapper">
              <Link size={18} className="twitter-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Twitter video link here..."
                className="twitter-input"
              />
            </div>
            <button className="twitter-btn" onClick={handleDownload}>
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="twitter-options">
            <span className="twitter-options-label">Options:</span>

            <button className="twitter-option-pill active">
              <Video size={14} />
              Video (MP4)
            </button>

            <select
              className="twitter-quality-select"
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