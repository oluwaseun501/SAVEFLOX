import { useState } from "react";
import { Download, Link, Globe, Video } from "lucide-react";
import "../styles/Hero.css";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");

  const handleDownload = () => {
    if (!url) return;
    console.log("Download URL:", url, "Quality:", quality);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        {/* Icon */}
        <div className="hero-icon">
          <Globe size={28} />
        </div>

        {/* Heading */}
        <h1 className="hero-heading">
          Download Any Video,<br />
          <span>Anywhere</span>
        </h1>

        {/* Subtext */}
        <p className="hero-subtext">
          The ultimate all-in-one downloader for TikTok, YouTube, Instagram,
          Facebook, and more. Fast, free, and no watermark.
        </p>

        {/* Downloader Card */}
        <div className="hero-card">
          {/* Input + Button */}
          <div className="hero-input-group">
            <div className="hero-input-wrapper">
              <Link size={18} className="hero-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any video URL here (TikTok, YouTube, Instagram...)"
                className="hero-input"
              />
            </div>
            <button className="hero-btn" onClick={handleDownload}>
              <Download size={18} />
              Download
            </button>
          </div>

          {/* Options Row */}
          <div className="hero-options">
            <span className="hero-options-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Options:
            </span>

            <button className="hero-option-pill active">
              <Video size={14} />
              Video (MP4)
            </button>

            <select
              className="hero-quality-select"
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