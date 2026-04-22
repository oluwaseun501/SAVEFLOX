import { useState } from "react";
import { Download, Link, Music2, Video } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Tiktok.css";

export default function Tiktok() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");

  const handleDownload = () => {
    if (!url) return;
    console.log("TikTok Download URL:", url, "Quality:", quality);
  };

  // Split the translated heading around {{platform}} so we can wrap "TikTok" in the gradient span
  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <section className="tiktok">
      <div className="tiktok-content">
        {/* Icon */}
        <div className="tiktok-icon">
          <Music2 size={28} />
        </div>

        {/* Heading */}
        <h1 className="tiktok-heading">
          {headingParts[0]}
          <span>TikTok</span>
          {headingParts[1]}
        </h1>

        {/* Subtext */}
        <p className="tiktok-subtext">
          {t("tiktok_subtext")}
        </p>

        {/* Downloader Card */}
        <div className="tiktok-card">
          {/* Input + Button */}
          <div className="tiktok-input-group">
            <div className="tiktok-input-wrapper">
              <Link size={18} className="tiktok-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("paste_link", { platform: "TikTok" })}
                className="tiktok-input"
              />
            </div>
            <button className="tiktok-btn" onClick={handleDownload}>
              <Download size={18} />
              {t("download")}
            </button>
          </div>

          {/* Options Row */}
          <div className="tiktok-options">
            <span className="tiktok-options-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              {t("options")}:
            </span>

            <button className="tiktok-option-pill active">
              <Video size={14} />
              {t("video_mp4")}
            </button>

            <select
              className="tiktok-quality-select"
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