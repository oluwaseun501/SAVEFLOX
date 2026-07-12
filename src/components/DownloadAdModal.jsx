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
  onCountdownEnd,
  skipDelay = 5,
  watchTime = 15,
  downloadDelay = 5,  // triggers download this many seconds after video starts
  backlink,
  page = "unknown",
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

  // Video ad — count down watchTime, then unlock the close button
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

  // Trigger download after downloadDelay seconds (before close button unlocks)
  useEffect(() => {
    if (type !== "video") return;
    const timer = setTimeout(() => {
      if (!downloadStarted) {
        setDownloadStarted(true);
        if (onCountdownEnd) onCountdownEnd();
      }
    }, downloadDelay * 1000);
    return () => clearTimeout(timer);
  }, [type, downloadDelay]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdClick = async () => {
    try {
      await supabase.from("ad_clicks").insert({
        slot: `${page}-popup-${type}`,
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
                  ? <span className="adm-ready">Your download is ready!</span>
                  : <span className="adm-unlocks">Close in <strong>{countdown}s</strong></span>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
