import { useState, useRef } from "react";
import { Download, Link, Globe, Video, Loader, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Hero.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export default function Hero() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  
  const abortControllerRef = useRef(null);

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
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    const platform = detectPlatformFromUrl(url);
    if (!platform) {
      setError("Unsupported platform. Please use TikTok, Instagram, Facebook, Pinterest, or Snapchat");
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

    const platform = detectPlatformFromUrl(url);
    if (!platform) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadSpeed(0);

    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url,
          platform: platform,
          quality: quality,
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get file size from headers (NOW WORKS!)
      const contentLength = response.headers.get("Content-Length");
      const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;
      let startTime = Date.now();
      let lastUpdate = Date.now();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Update progress every 100ms for smoother animation
        const now = Date.now();
        if (now - lastUpdate > 100 || done) {
          lastUpdate = now;
          
          if (totalSize > 0) {
            const progress = (receivedLength / totalSize) * 100;
            setDownloadProgress(progress);
          } else {
            // Fallback: show indeterminate progress
            setDownloadProgress(prev => (prev + 5) % 95);
          }
          
          const elapsed = (now - startTime) / 1000;
          if (elapsed > 0) {
            const speed = receivedLength / elapsed / 1024 / 1024;
            setDownloadSpeed(speed);
          }
        }
      }
      
      // Ensure 100% at completion
      setDownloadProgress(100);
      
      const blob = new Blob(chunks);
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "video.mp4";
      
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
      if (err.name !== 'AbortError') {
        setError("Download failed. Please try again.");
      }
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
        setDownloadSpeed(0);
      }, 1000);
      abortControllerRef.current = null;
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-icon">
          <Globe size={28} />
        </div>

        <h1 className="hero-heading">
          {t("hero_title")}<br />
          <span>{t("hero_highlight")}</span>
        </h1>

        <p className="hero-subtext">
          {t("hero_subtitle")}
        </p>

        <div className="hero-card">
          <div className="hero-input-group">
            <div className="hero-input-wrapper">
              <Link size={18} className="hero-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("paste_placeholder")}
                className="hero-input"
              />
            </div>
            <button 
              className="hero-btn" 
              onClick={handlePreview}
              disabled={loading}
            >
              {loading ? <Loader size={18} className="spinner" /> : <Download size={18} />}
              {loading ? "Analyzing..." : t("download")}
            </button>
          </div>

          <div className="hero-options">
            <span className="hero-options-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              {t("options")}:
            </span>

            <button className="hero-option-pill active">
              <Video size={14} />
              {t("video_mp4")}
            </button>

            <select
              className="hero-quality-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              {preview?.formats?.map((format) => (
                <option key={format.quality} value={format.quality}>
                  {format.quality} {format.filesize_mb ? `(${format.filesize_mb} MB)` : ''}
                </option>
              ))}
              {!preview?.formats && (
                <>
                  <option>4K Ultra HD</option>
                  <option>1080p HD</option>
                  <option>720p</option>
                  <option>480p</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Download Progress Bar - Now updates! */}
        {downloading && (
          <div className="hero-download-progress">
            <div className="progress-label">
              <span>Downloading video...</span>
              <span>{Math.round(downloadProgress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${downloadProgress}%` }}>
                {downloadProgress > 5 && `${Math.round(downloadProgress)}%`}
              </div>
            </div>
            {downloadSpeed > 0 && (
              <div className="progress-speed">⚡ {downloadSpeed.toFixed(1)} MB/s</div>
            )}
          </div>
        )}

        {/* Preview Section */}
        {preview && !downloading && (
          <div className="hero-preview">
            <div className="preview-header">
              <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
              <div className="preview-info">
                <h3>{preview.title}</h3>
                <p>👤 {preview.uploader}</p>
                <p>⏱️ {preview.duration}</p>
                <p>👁️ {formatNumber(preview.views)} views</p>
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
                    {format.filesize_mb && <span className="format-size">({format.filesize_mb} MB)</span>}
                  </button>
                ))}
              </div>
              <button 
                className="hero-download-btn"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download size={18} />
                Download Now
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="hero-error">
            <span>❌ {error}</span>
          </div>
        )}
      </div>
    </section>
  );
}