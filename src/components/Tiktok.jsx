import { useState } from "react";
import { Download, Link, Music2, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Tiktok.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import DotsLoader from "./DotsLoader";
import { Helmet } from "react-helmet-async";
import { TikTokDownloaderSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";
import ServicesStrip from "./ServicesStrip";
import CourseLinks from "./CourseLinks";
import { coursesByPlatform } from "../data/courseLinksData";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const SLIDESHOW_SERVER_URL =
  import.meta.env.VITE_SLIDESHOW_URL || "https://saveflox.onrender.com";
  // import.meta.env.VITE_SLIDESHOW_URL || "http://localhost:3001";

// 
const mountStyle = (delayMs) => ({
  animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both`,
});

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
    if (!targetUrl) {
      setError("Please enter a URL");
      return;
    }
    const platform = detectPlatformFromUrl(targetUrl);
    if (!platform) {
      setError("Unsupported platform.");
      return;
    }
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      if (platform === "tiktok") {
        const response = await fetch(`${SLIDESHOW_SERVER_URL}/tiktok/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "TikTok preview failed");
        }

        setPreview(data);
      } else {
        const response = await fetch(`${API_BASE_URL}/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl, platform }),
        });
        const data = await response.json();
        if (data.success) {
          setPreview(data);
        } else {
          setError(data.error || "Failed to fetch video info");
        }
      }
    } catch (err) {
      console.error("Preview error:", err);
      setError(
        "We couldn't load that video. Please check the link and try again.",
      );
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

  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const triggerDownload = async (qualityType, platform, formatId = null) => {
    const downloadKey =
      qualityType === "hd" ? "hd" : `normal-${formatId || "best"}`;

    setDownloading(downloadKey);

    try {
      // All TikTok videos use the Node server.
      if (platform === "tiktok") {
        const response = await fetch(
          `${SLIDESHOW_SERVER_URL}/tiktok/download`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
              quality: qualityType === "hd" ? "hd" : "normal",
            }),
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "TikTok download failed");
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = downloadUrl;
        a.download = "tiktok_video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        return;
      }

      // All other platforms continue using Python.
      const downloadData = {
        url,
        platform,
        quality: qualityType === "hd" ? "hd" : "normal",
      };

      if (qualityType !== "hd" && formatId) {
        downloadData.format_id = formatId;
      }

      if (isMobile()) {
        const params = new URLSearchParams(downloadData);
        window.location.href = `${API_BASE_URL}/download?${params}`;
        return;
      }

      const response = await fetch(`${API_BASE_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadData),
      });

      if (!response.ok) {
        let message = "Download failed";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");

      let filename = `${platform}_video.mp4`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
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
      console.error("Download error:", err);

      setError(
        platform === "tiktok"
          ? "This TikTok could not be downloaded. Please check the link and try again."
          : "This download could not be completed. Please try again.",
      );
    } finally {
      setDownloading(null);
    }
  };

  const triggerSlideDownload = async (slideIndex) => {
    setSlideDownloading((prev) => ({ ...prev, [slideIndex]: true }));
    try {
      const response = await fetch(`${SLIDESHOW_SERVER_URL}/tiktok/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, index: slideIndex }),
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `tiktok_slide_${slideIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      setSlideDone((prev) => ({ ...prev, [slideIndex]: true }));
    } catch {
      setError("Slide download failed. Please try again.");
    } finally {
      setSlideDownloading((prev) => ({ ...prev, [slideIndex]: false }));
    }
  };

  const handleDownload = (qualityType = "normal", formatId = null) => {
    if (!url || !preview) return;

    const platform = detectPlatformFromUrl(url);
    if (!platform) return;

    if (qualityType === "normal") {
      setAdModal("normal");
      triggerDownload(qualityType, platform, formatId);
    } else {
      // HD behavior remains unchanged.
      setAdModal("hd");
      setPendingDownload(() => () => triggerDownload("hd", platform));
    }
  };

  const headingParts = t("download_videos", { platform: "###" }).split("###");

  const normalFormats =
    Array.isArray(preview?.formats) && preview.formats.length > 0
      ? preview.formats.slice(0, 3)
      : [{ format_id: null, ext: "mp4", height: null }];

  return (
    <>
      {TikTokDownloaderSEO()}
      <Helmet>
        <title>TikTok Video Downloader — SaveFlox | Download Free</title>
        <meta
          name="description"
          content="Download TikTok videos without watermark for free. Fast, HD quality. No app needed."
        />
        <link
          rel="canonical"
          href="https://www.saveflox.com/tiktok-downloader"
        />
      </Helmet>

      {/* ── Services Strip: right below navbar ── */}
      <ServicesStrip currentPage="/tiktok-downloader" />

      <section className="tiktok">
        <div className="tiktok-content">
          <div className="tiktok-icon" style={mountStyle(0)}>
            <Music2 size={28} />
          </div>

          <h1 className="tiktok-heading" style={mountStyle(150)}>
            {headingParts[0]}
            <span>TikTok</span>
            {headingParts[1]}
          </h1>

          <p className="tiktok-subtext" style={mountStyle(300)}>
            {t("tiktok_subtext")}
          </p>

          <div className="tiktok-card" style={mountStyle(450)}>
            <div className="tiktok-input-group">
              <div className="tiktok-input-wrapper">
                <Link size={18} className="tiktok-input-icon" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t("paste_link", { platform: "TikTok" })}
                  className="tiktok-input"
                />
                <button
                  className="tiktok-paste-btn"
                  onClick={handlePasteOrClear}
                >
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button
                className="tiktok-btn"
                onClick={handlePreview}
                disabled={loading}
              >
                {loading ? (
                  "Please wait..."
                ) : (
                  <>
                    <Download size={18} /> {t("download")}
                  </>
                )}
              </button>
            </div>
            <div className="tiktok-options">
              <span className="tiktok-options-label">Options:</span>
              <button className="tiktok-option-pill active">
                <Video size={14} />
                {t("video_mp4")}
              </button>
            </div>
          </div>

          {pasteHint && <p className="tiktok-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}

          {preview && (
            <div className="tiktok-preview" style={mountStyle(0)}>
              <div className="preview-header">
                {preview.thumbnail ? (
                  <img
                    src={preview.thumbnail}
                    alt="Preview"
                    className="preview-thumbnail"
                  />
                ) : (
                  <div
                    className="preview-thumbnail"
                    role="img"
                    aria-label="Preview unavailable"
                  >
                    🎬
                  </div>
                )}
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                      marginTop: "16px",
                    }}
                  >
                    {preview.slides.map((slide) => (
                      <div
                        key={slide.index}
                        style={{
                          position: "relative",
                          borderRadius: "10px",
                          overflow: "hidden",
                          background: "#1a1a2e",
                        }}
                      >
                        <img
                          src={slide.thumbnail || slide.url}
                          alt={`Slide ${slide.index + 1}`}
                          style={{
                            width: "100%",
                            aspectRatio: "1/1",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: "6px",
                            left: "6px",
                            background: "rgba(0,0,0,0.65)",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "2px 7px",
                            borderRadius: "20px",
                          }}
                        >
                          {slide.index + 1}
                        </span>
                        <button
                          onClick={() => triggerSlideDownload(slide.index)}
                          disabled={
                            slideDownloading[slide.index] ||
                            slideDone[slide.index]
                          }
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: slideDone[slide.index]
                              ? "#22c55e"
                              : slideDownloading[slide.index]
                                ? "#555"
                                : "rgba(255,255,255,0.92)",
                            color: slideDone[slide.index]
                              ? "#fff"
                              : slideDownloading[slide.index]
                                ? "#fff"
                                : "#111",
                            border: "none",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor:
                              slideDownloading[slide.index] ||
                              slideDone[slide.index]
                                ? "default"
                                : "pointer",
                            whiteSpace: "nowrap",
                            transition: "background 0.2s",
                          }}
                        >
                          {slideDone[slide.index]
                            ? "✓ Saved"
                            : slideDownloading[slide.index]
                              ? "..."
                              : "↓ Save"}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="dl-btn dl-btn--normal"
                    style={{ marginTop: "14px", width: "100%" }}
                    onClick={() =>
                      preview.slides.forEach((s) => {
                        if (!slideDownloading[s.index] && !slideDone[s.index])
                          triggerSlideDownload(s.index);
                      })
                    }
                  >
                    <Download size={18} /> Download All ({preview.item_count}{" "}
                    images)
                  </button>
                </div>
              ) : (
                <div className="download-actions">
                  <p className="format-download-hint">
                    If one download option doesn’t work, please try the next
                    one.
                  </p>

                  {normalFormats.map((format, index) => {
                    const downloadKey = `normal-${format.format_id || "best"}`;

                    const qualityLabel = format.height
                      ? `${format.height}p`
                      : format.ext?.toUpperCase() || "Video";

                    return (
                      <button
                        key={format.format_id || `format-${index}`}
                        className="dl-btn dl-btn--normal"
                        onClick={() =>
                          handleDownload("normal", format.format_id)
                        }
                        disabled={downloading !== null}
                      >
                        {downloading === downloadKey ? (
                          <Loader size={18} className="spinner" />
                        ) : (
                          <Download size={18} />
                        )}

                        {downloading === downloadKey
                          ? "Downloading..."
                          : `Download ${index + 1} (${qualityLabel})`}
                      </button>
                    );
                  })}

                  <button
                    className="dl-btn dl-btn--hd"
                    onClick={() => handleDownload("hd")}
                    disabled={downloading !== null}
                  >
                    {downloading === "hd" ? (
                      <Loader size={18} className="spinner" />
                    ) : (
                      <Download size={18} />
                    )}

                    {downloading === "hd"
                      ? "Downloading..."
                      : "Download Video HD"}

                    {downloading !== "hd" && (
                      <span className="dl-hd-badge">HD</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="tiktok-error" style={mountStyle(0)}>
              <span>❌ {error}</span>
            </div>
          )}
        </div>
      </section>

      <AdSlot slot="tiktok-top" format="leaderboard" />
      <WhyChoose />
      <AdSlot slot="tiktok-middle" format="leaderboard" />
      <HowItWorks />
      <CourseLinks platform="tiktok" courses={coursesByPlatform.tiktok} />
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
            if (pendingDownload) {
              pendingDownload();
              setPendingDownload(null);
            }
          }}
          onClose={() => setAdModal(null)}
        />
      )}
    </>
  );
}
