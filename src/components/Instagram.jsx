import { useState } from "react";
import { Download, Link, Video, Loader, Eye, Heart, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Instagram.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";
import adsBanner from "../ads/ads1.jpg";
import adsVideo from "../ads/adsVid.mp4";
import adsBanner2 from "../ads/ads2.jpg";
import { Helmet } from "react-helmet-async";
import { InstagramDownloaderSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

export default function Instagram() {
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
      let filename = "instagram_video.mp4";
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

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      {InstagramDownloaderSEO()}
      <Helmet>
        <title>Instagram Video Downloader — SaveFlox | Download Reels & Videos</title>
        <meta name="description" content="Download Instagram videos, reels, and stories for free without watermark." />
        <link rel="canonical" href="https://www.saveflox.com/instagram-downloader" />
      </Helmet>

      <section className="instagram">
        <div className="instagram-content">
          <div className="instagram-icon" style={mountStyle(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </div>

          <h1 className="instagram-heading" style={mountStyle(150)}>
            {headingParts[0]}<span>Instagram</span>{headingParts[1]}
          </h1>
          <p className="instagram-subtext" style={mountStyle(300)}>{t("instagram_subtext")}</p>

          <div className="instagram-card" style={mountStyle(450)}>
            <div className="instagram-input-group">
              <div className="instagram-input-wrapper">
                <Link size={18} className="instagram-input-icon" />
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Instagram" })} className="instagram-input" />
                <button className="instagram-paste-btn" onClick={handlePasteOrClear}>{url ? "Clear" : "Paste"}</button>
              </div>
              <button className="instagram-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>
            <div className="instagram-options">
              <span className="instagram-options-label">Options:</span>
              <button className="instagram-option-pill active"><Video size={14} />{t("video_mp4")}</button>
            </div>
          </div>

          {pasteHint && <p className="instagram-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && <p className="instagram-slow-msg">Taking longer than usual, please wait...</p>}

          {preview && (
            <div className="instagram-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
                  <div className="preview-stats">
                    <span><Eye size={14} /> {formatNumber(preview.views)}</span>
                    <span><Heart size={14} /> {formatNumber(preview.likes)}</span>
                    <span><MessageCircle size={14} /> {formatNumber(preview.comment_count)}</span>
                  </div>
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

          {error && <div className="instagram-error" style={mountStyle(0)}><span>❌ {error}</span></div>}
        </div>
      </section>

      <AdSlot slot="instagram-top" format="leaderboard" image={adsBanner2} link="https://www.ghostnum.com" />
      <WhyChoose />
      <AdSlot slot="instagram-middle" format="leaderboard" image={adsBanner} link="https://www.saveflox.com" />
      <HowItWorks />
      <AdSlot slot="instagram-bottom" format="leaderboard" image={adsBanner2} link="https://www.ghostnum.com" />
      <FAQ />
      <RelatedServices currentPage="/instagram" />

     {adModal === "normal" && (
  <DownloadAdModal
  page="instagram"
    type="image"
    adImage={adsBanner}
    skipDelay={5}
    backlink="https://www.saveflox.com"   // ← your website URL
    onSkip={() => setAdModal(null)}
    onClose={() => setAdModal(null)}
  />
)}
            {adModal === "hd" && (
  <DownloadAdModal
  page="instagram"
    type="video"
    adVideo={adsVideo}
    watchTime={15}
    backlink="https://www.ghostnum.com"   // ← your website URL
    onCountdownEnd={() => {
      // download starts in background, modal stays open
      if (pendingDownload) { pendingDownload(); setPendingDownload(null); }
    }}
    onClose={() => setAdModal(null)}   // only closes the modal
  />
)}
    </>
  );
}