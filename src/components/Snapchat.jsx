import { useState } from "react";
import { Download, Link, Ghost, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Snapchat.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";
import { Helmet } from "react-helmet-async";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";
import ServicesStrip from "./ServicesStrip";
import CourseLinks from "./CourseLinks";
import { coursesByPlatform } from "../data/courseLinksData";

const SNAPCHAT_SERVER_URL = import.meta.env.VITE_SNAPCHAT_SERVER_URL || "http://localhost:3001";

const mountStyle = (delayMs) => ({
  animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both`,
});

export default function Snapchat() {
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

  const handlePreview = async (pastedUrl) => {
    const targetUrl = (typeof pastedUrl === "string" ? pastedUrl : null) || url;
    if (!targetUrl) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const response = await fetch(`${SNAPCHAT_SERVER_URL}/snapchat/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data);
      } else {
        setError(data.error || "Failed to fetch video info");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasteOrClear = async () => {
    if (url) {
      setUrl("");
      setPreview(null);
      setError(null);
    } else {
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

  const triggerDownload = async () => {
    setDownloading("normal");
    try {
      const response = await fetch(`${SNAPCHAT_SERVER_URL}/snapchat/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Snapchat download failed");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "snapchat_video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownload = () => {
    if (!url || !preview) return;
    setAdModal("normal");
    triggerDownload();
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  return (
    <>
      <Helmet>
        <title>Snapchat Spotlight Downloader — SaveFlox | Download Free</title>
        <meta name="description" content="Download Snapchat Spotlight videos for free in HD quality. Fast, safe, no app needed." />
        <link rel="canonical" href="https://www.saveflox.com/snapchat-downloader" />
      </Helmet>

      <ServicesStrip currentPage="/snapchat-downloader" />

      <section className="snapchat">
        <div className="snapchat-content">
          <div className="snapchat-icon" style={mountStyle(0)}>
            <Ghost size={28} />
          </div>

          <h1 className="snapchat-heading" style={mountStyle(150)}>
            {headingParts[0]}<span>Snapchat</span>{headingParts[1]}
          </h1>

          <p className="snapchat-subtext" style={mountStyle(300)}>
            Download Snapchat Spotlight videos instantly without watermark.
          </p>

          <div className="snapchat-card" style={mountStyle(450)}>
            <div className="snapchat-input-group">
              <div className="snapchat-input-wrapper">
                <Link size={18} className="snapchat-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "Snapchat" })}
                  className="snapchat-input"
                />
                <button className="snapchat-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="snapchat-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> {t("download")}</>}
              </button>
            </div>

            <div className="snapchat-options">
              <span className="snapchat-options-label">Options:</span>
              <button className="snapchat-option-pill active">
                <Video size={14} /> {t("video_mp4")}
              </button>
            </div>
          </div>

          {pasteHint && <p className="snapchat-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}

          {preview && (
            <div className="snapchat-preview" style={mountStyle(0)}>
              <div className="preview-header">
                {preview.thumbnail ? (
                  <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                ) : (
                  <div className="preview-thumbnail" role="img" aria-label="Preview unavailable">🎬</div>
                )}
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>👤 Snapchat User</p>
                  <p>⏱️ 0:15</p>
                </div>
              </div>

              <div className="download-actions">
                <p className="format-download-hint">
                  If the download doesn't work, please try again.
                </p>
                <button
                  className="dl-btn dl-btn--normal"
                  onClick={handleDownload}
                  disabled={downloading !== null}
                >
                  {downloading === "normal" ? (
                    <Loader size={18} className="spinner" />
                  ) : (
                    <Download size={18} />
                  )}
                  {downloading === "normal" ? "Downloading..." : "Download Video (MP4)"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="snapchat-error" style={mountStyle(0)}>
              <span>❌ {error}</span>
            </div>
          )}
        </div>
      </section>

      <AdSlot slot="snapchat-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="snapchat-middle" format="leaderboard" />
      <HowItWorks />
      <CourseLinks platform="snapchat" courses={coursesByPlatform.snapchat || []} />
      <AdSlot slot="snapchat-bottom" format="leaderboard" />
      <FAQ />
      <RelatedServices currentPage="/snapchat" />

      {adModal === "normal" && (
        <DownloadAdModal
          page="snapchat"
          type="image"
          adImage={popupImageAd?.image}
          backlink={popupImageAd?.link}
          skipDelay={5}
          onSkip={() => setAdModal(null)}
          onClose={() => setAdModal(null)}
        />
      )}
    </>
  );
}