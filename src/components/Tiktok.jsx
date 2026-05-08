// Tiktok.jsx - Updated with API integration
import { useState } from "react";
import { Download, Link, Music2, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Tiktok.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Tiktok() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const detectPlatformFromUrl = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
    return null;
  };

  // Get video preview first
  const handlePreview = async () => {
  if (!url) {
    setError("Please enter a URL");
    return;
  }

  const platform = detectPlatformFromUrl(url);
  if (!platform) {
    setError("Unsupported platform. Please use YouTube, TikTok, Twitter, Instagram, or Facebook");
    return;
  }

  setLoading(true);
  setError(null);
  setPreview(null);

  try {
    const response = await fetch(`${API_BASE_URL}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        url: url,
        platform: platform
      }),
    });

    const data = await response.json();

    // ALWAYS stop loading here, even on error
    setLoading(false);

    if (data.success) {
      setPreview(data);
      if (data.formats && data.formats.length > 0) {
        setQuality(data.formats[0].quality);
      }
    } else {
      // Show the actual error from backend
      setError(data.error || "Failed to fetch video info");
      console.error("Preview error:", data.error);
    }
  } catch (err) {
    setLoading(false);
    setError("Network error. Please try again.");
    console.error("Fetch error:", err);
  }
};

  // Download after preview
  const handleDownload = async () => {
    if (!url || !preview) return;

    setDownloading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url,
          platform: "tiktok",
          quality: quality,
          format_type: "video"
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the blob and trigger download
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "tiktok_video.mp4";
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
    } catch (err) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      <section className="tiktok">
        <div className="tiktok-content">
          <div className="tiktok-icon">
            <Music2 size={28} />
          </div>

          <h1 className="tiktok-heading">
            {headingParts[0]}
            <span>TikTok</span>
            {headingParts[1]}
          </h1>

          <p className="tiktok-subtext">{t("tiktok_subtext")}</p>

          <div className="tiktok-card">
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
              <button 
                className="tiktok-btn" 
                onClick={handlePreview}
                disabled={loading}
              >
                {loading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                {loading ? "Analyzing..." : t("download")}
              </button>
            </div>

            <div className="tiktok-options">
              <span className="tiktok-options-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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

          {/* Preview Section - Shows after analysis */}
          {preview && (
            <div className="tiktok-preview">
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration} • 👁️ {(preview.views / 1000000).toFixed(1)}M views</p>
                </div>
              </div>
              <div className="preview-formats">
                <h4>Available Qualities:</h4>
                <div className="format-buttons">
                  {preview.formats?.map((format) => (
                    <button
                      key={format.quality}
                      className={`format-btn ${quality === format.quality ? 'active' : ''}`}
                      onClick={() => setQuality(format.quality)}
                    >
                      {format.quality}
                      {format.note && <span className="format-note">{format.note}</span>}
                    </button>
                  ))}
                </div>
                <button 
                  className="tiktok-download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading ? "Downloading..." : "Download Now"}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="tiktok-error">
              <span>❌ {error}</span>
            </div>
          )}
        </div>
      </section>

      <AdSlot slot="tiktok-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="tiktok-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="tiktok-bottom" format="leaderboard" />
      <FAQ />
    </>
  );
}