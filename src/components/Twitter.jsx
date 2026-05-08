import { useState } from "react";
import { Download, Link, Video, Loader, Eye, Heart, Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Twitter.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Twitter() {
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

  const handleDownload = async () => {
    if (!url || !preview) return;

    setDownloading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url,
          platform: "twitter",
          quality: quality,
          format_type: "video"
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "twitter_video.mp4";
      
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

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      <section className="twitter">
        <div className="twitter-content">
          <div className="twitter-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
            </svg>
          </div>

          <h1 className="twitter-heading">
            {headingParts[0]}
            <span>Twitter/X</span>
            {headingParts[1]}
          </h1>

          <p className="twitter-subtext">
            {t("twitter_subtext")}
          </p>

          <div className="twitter-card">
            <div className="twitter-input-group">
              <div className="twitter-input-wrapper">
                <Link size={18} className="twitter-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Twitter/X" })}
                  className="twitter-input"
                />
              </div>
              <button 
                className="twitter-btn" 
                onClick={handlePreview}
                disabled={loading}
              >
                {loading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                {loading ? "Analyzing..." : t("download")}
              </button>
            </div>

            <div className="twitter-options">
              <span className="twitter-options-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {t("options")}:
              </span>

              <button className="twitter-option-pill active">
                <Video size={14} />
                {t("video_mp4")}
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

          {/* Preview Section */}
          {preview && (
            <div className="twitter-preview">
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
                  <div className="preview-stats">
                    <span><Eye size={14} /> {formatNumber(preview.views)}</span>
                    <span><Heart size={14} /> {formatNumber(preview.likes)}</span>
                    <span><Repeat size={14} /> {formatNumber(preview.retweets)}</span>
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
                <button 
                  className="twitter-download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading ? "Downloading..." : "Download Now"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="twitter-error">
              <span>❌ {error}</span>
            </div>
          )}
        </div>
      </section>

      <AdSlot slot="twitter-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="twitter-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="twitter-bottom" format="leaderboard" />
      <FAQ />
    </>
  );
}