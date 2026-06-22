import { useState } from "react";
import { Download, Link, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Pinterest.css";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import AdSlot from "./AdSlot";
import DotsLoader from "./DotsLoader";
// import adsBanner from "../ads/ads1.jpg";
// import adsBanner2 from "../ads/ads2.jpg";
// import adsBanner3 from "../ads/ads3.jpg";
// import adsVideo from "../ads/adsVid.mp4";

import { Helmet } from "react-helmet-async";
import { PinterestDownloaderSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

export default function Pinterest() {
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
      let filename = "pinterest_video.mp4";
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
      {PinterestDownloaderSEO()}
      <Helmet>
        <title>Pinterest Video Downloader — SaveFlox | Download Pinterest Videos</title>
        <meta name="description" content="Download Pinterest videos and GIFs for free. Paste your link and save instantly." />
        <link rel="canonical" href="https://www.saveflox.com/pinterest-downloader" />
      </Helmet>

      <section className="pinterest">
        <div className="pinterest-content">
          <div className="pinterest-icon" style={mountStyle(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </div>

          <h1 className="pinterest-heading" style={mountStyle(150)}>
            {headingParts[0]}<span>Pinterest</span>{headingParts[1]}
          </h1>
          <p className="pinterest-subtext" style={mountStyle(300)}>{t("pinterest_subtext")}</p>

          <div className="pinterest-card" style={mountStyle(450)}>
            <div className="pinterest-input-group">
              <div className="pinterest-input-wrapper">
                <Link size={18} className="pinterest-input-icon" />
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Pinterest" })} className="pinterest-input" />
                <button className="pinterest-paste-btn" onClick={handlePasteOrClear}>{url ? "Clear" : "Paste"}</button>
              </div>
              <button className="pinterest-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>
            <div className="pinterest-options">
              <span className="pinterest-options-label">Options:</span>
              <button className="pinterest-option-pill active"><Video size={14} />{t("video_mp4")}</button>
            </div>
          </div>

          {pasteHint && <p className="pinterest-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && <p className="pinterest-slow-msg">Taking longer than usual, please wait...</p>}

          {preview && (
            <div className="pinterest-preview" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 {preview.uploader}</p>
                  <p>⏱️ {preview.duration}</p>
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

          {error && <div className="pinterest-error" style={mountStyle(0)}><span>❌ {error}</span></div>}
        </div>
      </section>

      <AdSlot slot="pinterest-top" format="leaderboard"  />
      <WhyChoose />
      <AdSlot slot="pinterest-middle" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="pinterest-bottom" format="leaderboard"  />
      <FAQ />
      <RelatedServices currentPage="/pinterest" />

     {adModal === "normal" && (
       <DownloadAdModal
       page="pinterest"
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
       page="pinterest"
         type="video"
         adVideo={popupVideoAd?.video}
          backlink={popupVideoAd?.link} 
         watchTime={15}
         
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