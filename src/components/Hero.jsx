import { useState } from "react";
import { Download, Link, Globe, Video, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Hero.css";
import DotsLoader from "./DotsLoader";
import { Helmet } from "react-helmet-async";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";
import ServicesStrip from "./ServicesStrip"; // ← ADD THIS IMPORT

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const SLIDESHOW_SERVER_URL =
  import.meta.env.VITE_SLIDESHOW_URL || "https://saveflox.onrender.com";
const mountStyle = (delayMs) => ({
  animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both`,
});

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
  const [slideDownloading, setSlideDownloading] = useState({});
  const [slideDone, setSlideDone] = useState({});
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
        if (text) handlePreview(text);
      } catch {
        setPasteHint("Use Ctrl+V to paste");
        setTimeout(() => setPasteHint(""), 3000);
      }
    }
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

    setSlowWarning(false);

    const slowTimer = setTimeout(() => {
      setSlowWarning(true);
    }, 5000);

    setLoading(true);
    setError(null);
    setPreview(null);
    setSlideDownloading({});
    setSlideDone({});

    try {
      if (platform === "tiktok") {
        const response = await fetch(`${SLIDESHOW_SERVER_URL}/tiktok/preview`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: targetUrl }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(data.error || "TikTok preview failed");
        }

        setPreview(data);
      } else {
        const response = await fetch(`${API_BASE_URL}/preview`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: targetUrl,
            platform,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setPreview(data);
        } else {
          console.error("Preview API error:", data.error);
          setError(
            "We couldn't load that video. Please check the link and try again.",
          );
        }
      }
    } catch (err) {
      console.error("Preview error:", err);
      setError(
        "We couldn't load that video. Please check the link and try again.",
      );
    } finally {
      clearTimeout(slowTimer);
      setSlowWarning(false);
      setLoading(false);
    }
  };

  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const triggerDownload = async (qualityType, platform, formatId = null) => {
    const downloadKey =
      qualityType === "hd" ? "hd" : `normal-${formatId || "best"}`;

    setDownloading(downloadKey);

    try {
      // All TikTok video downloads use Node.
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

        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 1000);

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
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
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

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
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

  const normalFormats =
    Array.isArray(preview?.formats) && preview.formats.length > 0
      ? preview.formats.slice(0, 3)
      : [{ format_id: null, ext: "mp4", height: null }];

  return (
    <>
      <Helmet>
        <title>SaveFlox — Free Online Video Downloader</title>
        <meta
          name="description"
          content="Download videos from TikTok, Instagram, Facebook, Pinterest, Snapchat and more for free. Fast, HD quality, no watermark."
        />
        <link rel="canonical" href="https://www.saveflox.com/" />
      </Helmet>

      {/* ── Services Strip: sits right below the navbar, above everything else ── */}
      <ServicesStrip currentPage="/" />

      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon" style={mountStyle(0)}>
            <Globe size={28} />
          </div>

          <h1 className="hero-heading" style={mountStyle(150)}>
            {t("hero_title")}
            <br />
            <span>{t("hero_highlight")}</span>
          </h1>

          <p className="hero-subtext" style={mountStyle(300)}>
            {t("hero_subtitle")}
          </p>

          <div className="hero-card" style={mountStyle(450)}>
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
                <button className="hero-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button
                className="hero-btn"
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
            <div className="hero-options">
              <span className="hero-options-label">Options:</span>
              <button className="hero-option-pill active">
                <Video size={14} />
                {t("video_mp4")}
              </button>
            </div>
          </div>

          {pasteHint && <p className="hero-paste-hint">{pasteHint}</p>}
          {loading && <DotsLoader />}
          {slowWarning && (
            <p className="hero-slow-msg">
              Taking longer than usual, please wait...
            </p>
          )}

          {preview && (
            <div className="hero-preview" style={mountStyle(0)}>
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
                  <p>{preview.uploader}</p>
                  {preview.type === "slideshow" ? (
                    <p>🖼️ {preview.item_count} slides</p>
                  ) : (
                    <>
                      <p>{preview.duration}</p>
                      <p>{formatNumber(preview.views)} views</p>
                    </>
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
            <div className="hero-error" style={mountStyle(0)}>
              <span>❌ {error}</span>
            </div>
          )}
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
