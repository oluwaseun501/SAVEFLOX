import { useState } from "react";
import { Download, Link, Video, Loader, Eye, Heart, MessageCircle, Images } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Instagram.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mountStyle = (delayMs) => ({
  animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both`,
});

export default function Instagram() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const detectPlatformFromUrl = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
    if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) return 'pinterest';
    if (urlLower.includes('snapchat.com')) return 'snapchat';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    return null;
  };

  const handlePreview = async () => {
    if (!url) { setError("Please enter a URL"); return; }
    const platform = detectPlatformFromUrl(url);
    if (!platform) { setError("Unsupported platform. Please use TikTok, Instagram, Facebook, Pinterest, Snapchat, or Twitter"); return; }
    setLoading(true); setError(null); setPreview(null);
    try {
      const response = await fetch(`${API_BASE_URL}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        setPreview(data);
        if (data.formats && data.formats.length > 0) setQuality(data.formats[0].quality);
      } else {
        setError(data.error || "Failed to fetch video info");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  const handleDownload = async () => {
    if (!url || !preview) return;
    setDownloading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform: "instagram", quality, format_type: "video" }),
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "instagram_video.mp4";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      <section className="instagram">
        <div className="instagram-content">

          <div className="instagram-icon" style={mountStyle(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </div>

          <h1 className="instagram-heading" style={mountStyle(150)}>
            {headingParts[0]}
            <span>Instagram</span>
            {headingParts[1]}
          </h1>

          <p className="instagram-subtext" style={mountStyle(300)}>
            {t("instagram_subtext")}
          </p>

          <div className="instagram-card" style={mountStyle(450)}>
            <div className="instagram-input-group">
              <div className="instagram-input-wrapper">
                <Link size={18} className="instagram-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Instagram" })}
                  className="instagram-input"
                />
              </div>
              <button className="instagram-btn" onClick={handlePreview} disabled={loading}>
                {loading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                {loading ? "Analyzing..." : t("download")}
              </button>
            </div>

            <div className="instagram-options">
              <span className="instagram-options-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33A1.65 1.65 0 0 0 9 4.6V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {t("options")}:
              </span>
              <button className="instagram-option-pill active">
                <Video size={14} />
                {t("video_mp4")}
              </button>
              <select className="instagram-quality-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option>4K Ultra HD</option>
                <option>1080p HD</option>
                <option>720p</option>
                <option>480p</option>
              </select>
            </div>
          </div>

          {preview && (
            <div className="instagram-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
                  {preview.type === 'carousel' && (
                    <p><Images size={14} /> Carousel with {preview.item_count} items</p>
                  )}
                  <div className="preview-stats">
                    <span><Eye size={14} /> {formatNumber(preview.views)}</span>
                    <span><Heart size={14} /> {formatNumber(preview.likes)}</span>
                    <span><MessageCircle size={14} /> {formatNumber(preview.comment_count)}</span>
                  </div>
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
                    </button>
                  ))}
                </div>
                <button className="instagram-download-btn" onClick={handleDownload} disabled={downloading}>
                  {downloading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading ? "Downloading..." : "Download Now"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="instagram-error" style={mountStyle(0)}>
              <span>❌ {error}</span>
            </div>
          )}

        </div>
      </section>

      <AdSlot slot="instagram-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="instagram-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="instagram-bottom" format="leaderboard" />
      <FAQ />
    </>
  );
}