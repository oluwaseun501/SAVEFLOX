import { useState } from "react";
import { Download, Link, Video, Loader, Eye, Heart, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Facebook.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";
import adsBanner from "../ads/ads1.jpg";
import adsVideo from "../ads/adsVid.mp4";
import adsBanner2 from "../ads/ads2.jpg";
import { Helmet } from "react-helmet-async";
import { FacebookDownloaderSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

export default function Facebook() {
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
        body: JSON.stringify({
          url,
          platform,
          quality: qualityType === "hd" ? "hd" : "normal",
          format_type: "video",
        }),
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
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
    } catch { setError("Download failed. Please try again."); }
    finally { setDownloading(null); }
  };

  const handleDownload = (qualityType = "normal") => {
    if (!url || !preview) return;
    const platform = detectPlatformFromUrl(url);
    if (!platform) return;
    if (qualityType === "normal") {
      setAdModal("normal");
      triggerDownload(qualityType, platform);
    } else {
      setAdModal("hd");
      setPendingDownload(() => () => triggerDownload(qualityType, platform));
    }
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      {FacebookDownloaderSEO()}
      <Helmet>
        <title>Facebook Video Downloader — SaveFlox | Save FB Videos Free</title>
        <meta name="description" content="Download Facebook videos for free in HD or SD quality. Paste any Facebook video link and download instantly with SaveFlox." />
        <link rel="canonical" href="https://www.saveflox.com/facebook-downloader" />
      </Helmet>

      <section className="facebook">
        <div className="facebook-content">

          <div className="facebook-icon" style={mountStyle(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>

          <h1 className="facebook-heading" style={mountStyle(150)}>
            {headingParts[0]}<span>Facebook</span>{headingParts[1]}
          </h1>

          <p className="facebook-subtext" style={mountStyle(300)}>{t("facebook_subtext")}</p>

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
              <span className="facebook-options-label">Options:</span>
              <button className="facebook-option-pill active">
                <Video size={14} />{t("video_mp4")}
              </button>
            </div>
          </div>

          {pasteHint && <p className="facebook-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && <p className="facebook-slow-msg">Taking longer than usual, please wait...</p>}

          {preview && (
            <div className="facebook-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
                  <div className="preview-stats">
                    <span><Eye size={14} /> {formatNumber(preview.views)}</span>
                    <span><Heart size={14} /> {formatNumber(preview.likes)}</span>
                    <span><Share2 size={14} /> {formatNumber(preview.shares)}</span>
                  </div>
                </div>
              </div>

              <div className="download-actions">
                <button
                  className="dl-btn dl-btn--normal"
                  onClick={() => handleDownload("normal")}
                  disabled={downloading !== null}
                >
                  {downloading === "normal"
                    ? <Loader size={18} className="spinner" />
                    : <Download size={18} />}
                  {downloading === "normal" ? "Downloading..." : "Download Video"}
                </button>

                <button
                  className="dl-btn dl-btn--hd"
                  onClick={() => handleDownload("hd")}
                  disabled={downloading !== null}
                >
                  {downloading === "hd"
                    ? <Loader size={18} className="spinner" />
                    : <Download size={18} />}
                  {downloading === "hd" ? "Downloading..." : "Download Video HD"}
                  {downloading !== "hd" && <span className="dl-hd-badge">HD</span>}
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

      <AdSlot slot="facebook-top" format="leaderboard" image={adsBanner2} link="https://www.ghostnum.com" />
      <WhyChoose />
      <AdSlot slot="facebook-bottom" format="leaderboard" image={adsBanner} link="https://www.saveflox.com" />
      <HowItWorks />
      <AdSlot slot="facebook-top" format="leaderboard" image={adsBanner2} link="https://www.ghostnum.com" />
      <FAQ />
      <RelatedServices currentPage="/facebook" />

     {adModal === "normal" && (
  <DownloadAdModal
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