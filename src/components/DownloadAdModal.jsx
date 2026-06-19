import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "../styles/DownloadAdModal.css";
import { supabase } from "../lib/supabase";

export default function DownloadAdModal({
  type,
  adImage,
  adVideo,
  onClose,
  onSkip,
  onCountdownEnd,   // NEW: called when watchTime is up (triggers download in bg)
  skipDelay = 5,
  watchTime = 15,
  backlink,         // NEW: URL to open when clicking the ad
}) {
  const [countdown, setCountdown] = useState(watchTime);
  const [canClose, setCanClose] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const videoRef = useRef(null);

  // Image ad — show skip after delay
  useEffect(() => {
    if (type === "image") {
      const timer = setTimeout(() => setSkipVisible(true), skipDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [type, skipDelay]);

  // Video ad — count down, then trigger download in background, unlock close button
  useEffect(() => {
    if (type !== "video") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [type, watchTime]);

  // When countdown ends, trigger download in background (don't auto-close)
  useEffect(() => {
    if (!canClose || type !== "video" || downloadStarted) return;
    setDownloadStarted(true);
    if (onCountdownEnd) onCountdownEnd(); // starts download in background
  }, [canClose, type, onCountdownEnd, downloadStarted]);

  const handleAdClick = async () => {
  try {
    await supabase.from("ad_clicks").insert({
      slot: "download-popup",
      link: backlink || "none",
    });
  } catch (err) {
    // silent fail
  }
  if (backlink) window.open(backlink, "_blank", "noopener,noreferrer");
};

  return (
    <div className="adm-overlay">
      <div className="adm-box">
        <div className="adm-top-bar">
          <span className="adm-label">Advertisement</span>
          {type === "video" ? (
            <button
              className={`adm-close-btn ${canClose ? "adm-close-active" : "adm-close-locked"}`}
              onClick={canClose ? onClose : undefined}
              disabled={!canClose}
            >
              {canClose ? <X size={14} /> : <span className="adm-countdown">{countdown}</span>}
            </button>
          ) : (
            <button
              className={`adm-close-btn ${skipVisible ? "adm-close-active" : "adm-close-locked"}`}
              onClick={skipVisible ? onSkip : undefined}
              disabled={!skipVisible}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="adm-content">
          {type === "image" && (
            <>
              <div
                onClick={handleAdClick}
                style={{ cursor: backlink ? "pointer" : "default" }}
              >
                {adImage
                  ? <img src={adImage} alt="Advertisement" className="adm-image" />
                  : <div className="adm-placeholder"><span>Advertisement</span></div>
                }
              </div>
              {skipVisible
                ? <button className="adm-skip-pill" onClick={onSkip}>Skip Ad</button>
                : <div className="adm-wait-msg">Your download is starting <span>· Skip in {skipDelay}s</span></div>
              }
            </>
          )}

          {type === "video" && (
            <>
              <div
                onClick={handleAdClick}
                style={{ cursor: backlink ? "pointer" : "default", position: "relative" }}
              >
                {adVideo
                  ? <video ref={videoRef} className="adm-video" autoPlay src={adVideo} onEnded={() => setCanClose(true)} />
                  : (
                    <div className="adm-placeholder adm-placeholder--video">
                      <div className="adm-fake-video">
                        <span className="adm-fake-play">▶</span>
                        <span>Ad video</span>
                      </div>
                    </div>
                  )
                }
              </div>
             <div className="adm-video-footer">
                {canClose
                  ? <span className="adm-ready">Starting your HD download…</span>
                  : <span className="adm-unlocks">HD download begins in <strong>{countdown}s</strong></span>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}