import { useState } from "react";
import { Download, Link, Music2, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Tiktok.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";
// import adsBanner from "../ads/ads1.jpg";
// import adsVideo from "../ads/adsVid.mp4";
// import adsBanner2 from "../ads/ads2.jpg";
// import adsBanner3 from "../ads/ads3.jpg";
import { Helmet } from "react-helmet-async";
import { TikTokDownloaderSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

export default function Tiktok() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [pasteHint, setPasteHint] = useState("");
  const [adModal, setAdModal] = useState(null);
  const [pendingDownload, setPendingDownload] = useState(null);
  const popupImageAd = useAdRotation("popup-image");
  const popupVideoAd = useAdRotation("popup-video");
  const [slideDownloading, setSlideDownloading] = useState({});
const [slideDone, setSlideDone] = useState({});


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
    setLoading(true); setError(null); setPreview(null);
    try {
      const response = await fetch(`${API_BASE_URL}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, platform }),
      });
      const data = await response.json();
      if (data.success) { setPreview(data); }
      else { setError(data.error || "Failed to fetch video info"); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handlePasteOrClear = async () => {
    if (url) { setUrl(""); setPreview(null); setError(null); }
    else {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text);
        if (text) handlePreview(text);
      } catch {
        setPasteHint("Use Ctrl+V to paste");
        setTimeout(() => setPasteHint(""), 3000);
      }
    }
  };

  const triggerDownload = async (qualityType, platform) => {
    setDownloading(qualityType);
    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform, quality: qualityType === "hd" ? "hd" : "normal", format_type: "video" }),
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "tiktok_video.mp4";
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

  const triggerSlideDownload = async (slideIndex) => {
  setSlideDownloading((prev) => ({ ...prev, [slideIndex]: true }));
  try {
    const response = await fetch(`${API_BASE_URL}/tiktok/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, slide_index: slideIndex }),
    });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `tiktok_slide_${slideIndex + 1}.jpg`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(downloadUrl);
    setSlideDone((prev) => ({ ...prev, [slideIndex]: true }));
  } catch { setError("Slide download failed. Please try again."); }
  finally { setSlideDownloading((prev) => ({ ...prev, [slideIndex]: false })); }
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
      {TikTokDownloaderSEO()}
      <Helmet>
        <title>TikTok Video Downloader — SaveFlox | Download Free</title>
        <meta name="description" content="Download TikTok videos without watermark for free. Fast, HD quality. No app needed." />
        <link rel="canonical" href="https://www.saveflox.com/tiktok-downloader" />
      </Helmet>

      <section className="tiktok">
        <div className="tiktok-content">
          <div className="tiktok-icon" style={mountStyle(0)}><Music2 size={28} /></div>

          <h1 className="tiktok-heading" style={mountStyle(150)}>
            {headingParts[0]}<span>TikTok</span>{headingParts[1]}
          </h1>

          <p className="tiktok-subtext" style={mountStyle(300)}>{t("tiktok_subtext")}</p>

          <div className="tiktok-card" style={mountStyle(450)}>
            <div className="tiktok-input-group">
              <div className="tiktok-input-wrapper">
                <Link size={18} className="tiktok-input-icon" />
                <input
                  type="text" value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "TikTok" })}
                  className="tiktok-input"
                />
                <button className="tiktok-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="tiktok-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>
            <div className="tiktok-options">
              <span className="tiktok-options-label">Options:</span>
              <button className="tiktok-option-pill active"><Video size={14} />{t("video_mp4")}</button>
            </div>
          </div>

          {pasteHint && <p className="tiktok-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}

          {preview && (
  <div className="tiktok-preview" style={mountStyle(0)}>
    <div className="preview-header">
      <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
      <div className="preview-info">
        <h3>{preview.title}</h3>
        <p>👤 {preview.uploader}</p>
        {preview.type === "slideshow" ? (
          <p>🖼️ {preview.item_count} slides</p>
        ) : (
          <p>⏱️ {preview.duration}</p>
        )}
      </div>
    </div>

    {preview.type === "slideshow" ? (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "16px" }}>
          {preview.slides.map((slide) => (
            <div key={slide.index} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", background: "#1a1a2e" }}>
              <img
                src={slide.thumbnail || slide.url}
                alt={`Slide ${slide.index + 1}`}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "11px", fontWeight: "600", padding: "2px 7px", borderRadius: "20px" }}>
                {slide.index + 1}
              </span>
              <button
                onClick={() => triggerSlideDownload(slide.index)}
                disabled={slideDownloading[slide.index] || slideDone[slide.index]}
                style={{
                  position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)",
                  background: slideDone[slide.index] ? "#22c55e" : slideDownloading[slide.index] ? "#555" : "rgba(255,255,255,0.92)",
                  color: slideDone[slide.index] ? "#fff" : slideDownloading[slide.index] ? "#fff" : "#111",
                  border: "none", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "600",
                  cursor: slideDownloading[slide.index] || slideDone[slide.index] ? "default" : "pointer",
                  whiteSpace: "nowrap", transition: "background 0.2s",
                }}
              >
                {slideDone[slide.index] ? "✓ Saved" : slideDownloading[slide.index] ? "..." : "↓ Save"}
              </button>
            </div>
          ))}
        </div>
        <button
          className="dl-btn dl-btn--normal"
          style={{ marginTop: "14px", width: "100%" }}
          onClick={() => preview.slides.forEach((s) => { if (!slideDownloading[s.index] && !slideDone[s.index]) triggerSlideDownload(s.index); })}
        >
          <Download size={18} /> Download All ({preview.item_count} images)
        </button>
      </div>
    ) : (
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
    )}
  </div>
)}

          {error && <div className="tiktok-error" style={mountStyle(0)}><span>❌ {error}</span></div>}
        </div>
      </section>

            <AdSlot slot="tiktok-top" format="leaderboard" />
            <WhyChoose />
      <AdSlot slot="tiktok-middle" format="leaderboard" />
            <HowItWorks />
            <AdSlot slot="tiktok-bottom" format="leaderboard" />
            <FAQ />
            <RelatedServices currentPage="/tiktok" />
      
           {adModal === "normal" && (
        <DownloadAdModal
        page="tiktok"
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
        page="tiktok"
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