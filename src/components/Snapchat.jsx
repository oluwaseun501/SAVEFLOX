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

export default function Snapchat() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [pasteHint, setPasteHint] = useState("");
  const [adModal, setAdModal] = useState(null);
  const popupImageAd = useAdRotation("popup-image");

  const handlePreview = async () => {
    if (!url) {
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
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.success) setPreview(data);
      else setError(data.error || "Failed to fetch video info");
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
        if (text) handlePreview();
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
      if (!response.ok) throw new Error("Snapchat download failed");
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

  return (
    <>
      <Helmet>
        <title>Snapchat Spotlight Downloader — SaveFlox</title>
        <meta name="description" content="Download Snapchat Spotlight videos free." />
      </Helmet>

      <ServicesStrip currentPage="/snapchat-downloader" />

      <section className="snapchat">
        <div className="snapchat-content">
          
          {/* Icon */}
          <div className="snapchat-icon">
            <Ghost size={28} />
          </div>

          {/* Title */}
          <h1 className="snapchat-heading">
            Download <span>Snapchat</span> Videos
          </h1>

          <p className="snapchat-subtext">
            Download Snapchat Spotlight videos instantly without watermark.
          </p>

          {/* Main Box */}
          <div className="snapchat-card">
            <div className="snapchat-input-group">
              <div className="snapchat-input-wrapper">
                <Link size={18} className="snapchat-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste Snapchat Spotlight link here..."
                  className="snapchat-input"
                />
                <button className="snapchat-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="snapchat-btn" onClick={handlePreview} disabled={loading}>
                {loading ? "Please wait..." : <><Download size={18} /> Download</>}
              </button>
            </div>
          </div>

          {pasteHint && <p className="snapchat-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}

          {preview && (
            <div className="snapchat-preview">
              <div className="preview-header">
                {preview.thumbnail ? (
                  <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                ) : (
                  <div className="preview-thumbnail">🎬</div>
                )}
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                </div>
              </div>
              <div className="download-actions">
                <button
                  className="dl-btn dl-btn--normal"
                  onClick={handleDownload}
                  disabled={downloading !== null}
                >
                  {downloading === "normal" ? <Loader size={18} className="spinner" /> : <Download size={18} />}
                  {downloading === "normal" ? "Downloading..." : "Download Video (MP4)"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="snapchat-error">
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