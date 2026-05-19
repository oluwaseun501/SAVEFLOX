import { useState, useRef } from "react";
import { Download, Link, Video, Loader, Eye, Heart, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Facebook.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const mountStyle = (delayMs) => ({
  animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both`,
});

export default function Facebook() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080p HD");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [pasteHint, setPasteHint] = useState("");
  const [slowWarning, setSlowWarning] = useState(false);
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

  const handlePasteOrClear = async () => {
    if (url) {
      setUrl("");
      setPreview(null);
      setError(null);
      setPasteHint("");
    } else {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text);
        setPasteHint("");
      } catch {
        setPasteHint("Use Ctrl+V to paste");
        setTimeout(() => setPasteHint(""), 3000);
      }
    }
  };

  const handlePreview = async () => {
    if (!url) { setError("Please enter a URL"); return; }
    const platform = detectPlatformFromUrl(url);
    if (!platform) { setError("Unsupported platform. Please use TikTok, Instagram, Facebook, Pinterest, Snapchat, or Twitter"); return; }

    setSlowWarning(false);
    const slowTimer = setTimeout(() => setSlowWarning(true), 5000);
    setLoading(true); setError(null); setPreview(null);

    try {
      const response = await fetch(`${API_BASE_URL}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });
      const data = await response.json();
      if (data.success) {
        setPreview(data);
        if (data.formats && data.formats.length > 0) setQuality(data.formats[0].quality);
      } else {
        setError(data.error || "Failed to fetch video info");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      setSlowWarning(false);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url || !preview) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setDownloading(true); setDownloadProgress(0); setDownloadSpeed(0);
    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform: "facebook", quality }),
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error("Download failed");
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
        chunks.push(value); receivedLength += value.length;
        const now = Date.now();
        if (now - lastUpdate > 100 || done) {
          lastUpdate = now;
          if (totalSize > 0) setDownloadProgress((receivedLength / totalSize) * 100);
          else setDownloadProgress(prev => (prev + 5) % 95);
          const elapsed = (now - startTime) / 1000;
          if (elapsed > 0) setDownloadSpeed(receivedLength / elapsed / 1024 / 1024);
        }
      }
      setDownloadProgress(100);
      const blob = new Blob(chunks);
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "facebook_video.mp4";
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
      if (err.name !== 'AbortError') setError("Download failed. Please try again.");
    } finally {
      setTimeout(() => { setDownloading(false); setDownloadProgress(0); setDownloadSpeed(0); }, 1000);
      abortControllerRef.current = null;
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
      <section className="facebook">
        <div className="facebook-content">

          <div className="facebook-icon" style={mountStyle(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>

          <h1 className="facebook-heading" style={mountStyle(150)}>
            {headingParts[0]}
            <span>Facebook</span>
            {headingParts[1]}
          </h1>

          <p className="facebook-subtext" style={mountStyle(300)}>
            {t("facebook_subtext")}
          </p>

          <div className="facebook-card" style={mountStyle(450)}>
            <div className="facebook-input-group">
              <div className="facebook-input-wrapper">
                <Link size={18} className="facebook-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Facebook" })}
                  className="facebook-input"
                />
                <button className="facebook-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="facebook-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>

            <div className="facebook-options">
              <span className="facebook-options-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {t("options")}:
              </span>
              <button className="facebook-option-pill active">
                <Video size={14} />
                {t("video_mp4")}
              </button>
              <select className="facebook-quality-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
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

          {pasteHint && <p className="facebook-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && <p className="facebook-slow-msg">Taking longer than usual, please wait...</p>}

          {downloading && (
            <div className="download-progress" style={mountStyle(0)}>
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

          {preview && !downloading && (
            <div className="facebook-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
                  <div className="preview-stats">
                    <span><Eye size={14} /> {formatNumber(preview.views)}</span>
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
                      {format.filesize_mb && <span className="format-size">({format.filesize_mb} MB)</span>}
                    </button>
                  ))}
                </div>
                <button className="facebook-download-btn" onClick={handleDownload} disabled={downloading}>
                  <Download size={18} />
                  Download Now
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="facebook-error" style={mountStyle(0)}>
              <span>❌ {error}</span>
            </div>
          )}

        </div>
      </section>

      <AdSlot slot="facebook-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="facebook-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="facebook-bottom" format="leaderboard" />
      <FAQ />
    </>
  );
}