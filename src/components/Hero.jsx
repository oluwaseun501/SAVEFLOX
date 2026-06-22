import { useState } from "react";
import { Download, Link, Globe, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Hero.css";
import DotsLoader from "./DotsLoader";
// import adsBanner from "../ads/ads1.jpg";
// import adsBanner3 from "../ads/ads3.jpg";
// import adsVideo from "../ads/adsVid.mp4";
import { Helmet } from "react-helmet-async";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

export default function Hero() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [pasteHint, setPasteHint] = useState("");
  const [slowWarning, setSlowWarning] = useState(false);
  const [adModal, setAdModal] = useState(null);
  const [pendingDownload, setPendingDownload] = useState(null);
    const popupImageAd = useAdRotation("popup-image");
  const popupVideoAd = useAdRotation("popup-video");


  const detectPlatformFromUrl = (u) => {
    const l = u.toLowerCase();
    if (l.includes("tiktok.com")) return "tiktok";
    if (l.includes("instagram.com")) return "instagram";
    if (l.includes("facebook.com") || l.includes("fb.com")) return "facebook";
    if (l.includes("pinterest.com") || l.includes("pin.it")) return "pinterest";
    if (l.includes("snapchat.com")) return "snapchat";
    if (l.includes("twitter.com") || l.includes("x.com")) return "twitter";
    return null;
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handlePasteOrClear = async () => {
    if (url) { setUrl(""); setPreview(null); setError(null); setPasteHint(""); }
    else {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text); setPasteHint("");
        if (text) handlePreview(text);
      } catch { setPasteHint("Use Ctrl+V to paste"); setTimeout(() => setPasteHint(""), 3000); }
    }
  };

  const handlePreview = async (pastedUrl) => {
    const targetUrl = (typeof pastedUrl === "string" ? pastedUrl : null) || url;
    if (!targetUrl) { setError("Please enter a URL"); return; }
    const platform = detectPlatformFromUrl(targetUrl);
    if (!platform) { setError("Unsupported platform."); return; }
    setSlowWarning(false);
    const slowTimer = setTimeout(() => setSlowWarning(true), 5000);
    setLoading(true); setError(null); setPreview(null);
    try {
      const response = await fetch(`${API_BASE_URL}/preview`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, platform }),
      });
      const data = await response.json();
      if (data.success) setPreview(data);
      else setError(data.error || "Failed to fetch video info");
    } catch { setError("Network error. Please try again."); }
    finally { clearTimeout(slowTimer); setSlowWarning(false); setLoading(false); }
  };

  const triggerDownload = async (qualityType, platform) => {
    setDownloading(qualityType);
    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform, quality: qualityType === "hd" ? "hd" : "normal", format_type: "video" }),
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${platform}_video.mp4`;
      if (contentDisposition) { const match = contentDisposition.match(/filename="?([^"]+)"?/); if (match) filename = match[1]; }
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(downloadUrl);
    } catch { setError("Download failed. Please try again."); }
    finally { setDownloading(null); }
  };

  const handleDownload = (qualityType = "normal") => {
    if (!url || !preview) return;
    const platform = detectPlatformFromUrl(url);
    if (!platform) return;
    if (qualityType === "normal") { setAdModal("normal"); triggerDownload(qualityType, platform); }
    else { setAdModal("hd"); setPendingDownload(() => () => triggerDownload(qualityType, platform)); }
  };

  return (
    <>
      <Helmet>
        <title>SaveFlox — Free Online Video Downloader</title>
        <meta name="description" content="Download videos from TikTok, Instagram, Facebook, Pinterest, Snapchat and more for free. Fast, HD quality, no watermark." />
        <link rel="canonical" href="https://www.saveflox.com/" />
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon" style={mountStyle(0)}><Globe size={28} /></div>

          <h1 className="hero-heading" style={mountStyle(150)}>
            {t("hero_title")}<br /><span>{t("hero_highlight")}</span>
          </h1>

          <p className="hero-subtext" style={mountStyle(300)}>{t("hero_subtitle")}</p>

          <div className="hero-card" style={mountStyle(450)}>
            <div className="hero-input-group">
              <div className="hero-input-wrapper">
                <Link size={18} className="hero-input-icon" />
                <input
                  type="text" value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_placeholder")}
                  className="hero-input"
                />
                <button className="hero-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="hero-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>
            <div className="hero-options">
              <span className="hero-options-label">Options:</span>
              <button className="hero-option-pill active"><Video size={14} />{t("video_mp4")}</button>
            </div>
          </div>

          {pasteHint && <p className="hero-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && <p className="hero-slow-msg">Taking longer than usual, please wait...</p>}

          {preview && (
            <div className="hero-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p> {preview.uploader}</p>
                  <p> {preview.duration}</p>
                  <p> {formatNumber(preview.views)} views</p>
                </div>
              </div>
              <div className="download-actions">
                <button className="dl-btn dl-btn--normal" onClick={() => handleDownload("normal")} disabled={downloading !== null}>
                  {downloading === "normal" ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading === "normal" ? "Downloading..." : "Download Video"}
                </button>
                <button className="dl-btn dl-btn--hd" onClick={() => handleDownload("hd")} disabled={downloading !== null}>
                  {downloading === "hd" ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading === "hd" ? "Downloading..." : "Download Video HD"}
                  {downloading !== "hd" && <span className="dl-hd-badge">HD</span>}
                </button>
              </div>
            </div>
          )}

          {error && <div className="hero-error" style={mountStyle(0)}><span>❌ {error}</span></div>}
        </div>
      </section>
{adModal === "normal" && (
  <DownloadAdModal
  page="home"
    type="image"
     adImage={popupImageAd?.image}   
      backlink={popupImageAd?.link} 
    skipDelay={5}
   
    onSkip={() => setAdModal(null)}
    onClose={() => setAdModal(null)}
  />
)}
{adModal === "hd" && (
  <DownloadAdModal
  page="home"
    type="video"
   adVideo={popupVideoAd?.video}
    backlink={popupVideoAd?.link} 
    watchTime={15}
    
    onCountdownEnd={() => {
      if (pendingDownload) { pendingDownload(); setPendingDownload(null); }
    }}
    onClose={() => setAdModal(null)}
  />
)}
    </>
  );
}