import { useEffect, useState } from "react";
import { useAds } from "../context/AdsContext";
import { useEntryAdRotation } from "../hooks/useEntryAdRotation";
import "../styles/EntryAd.css";

const ENTRY_AD_DISMISSED_KEY = "sf_entry_ad_dismissed";

function getInitialVisibility() {
  try {
    const navigation = performance.getEntriesByType("navigation")[0];

    if (navigation?.type !== "reload") {
      sessionStorage.removeItem(ENTRY_AD_DISMISSED_KEY);
    }

    return sessionStorage.getItem(ENTRY_AD_DISMISSED_KEY) !== "true";
  } catch {
    return true;
  }
}

export default function EntryAd() {
  const { adsEnabled } = useAds();
  const selectedAd = useEntryAdRotation();

  const [isOpen, setIsOpen] = useState(getInitialVisibility);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    setCanClose(false);

    const timer = window.setTimeout(() => {
      setCanClose(true);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        try {
          sessionStorage.removeItem(ENTRY_AD_DISMISSED_KEY);
        } catch {
          // Ignore storage errors
        }

        setCanClose(false);
        setIsOpen(true);
      }
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && isOpen && canClose) {
        closeAd();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, canClose]);

  function closeAd() {
    if (!canClose) return;

    try {
      sessionStorage.setItem(ENTRY_AD_DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors
    }

    setIsOpen(false);
  }

  if (!adsEnabled || !isOpen || !selectedAd) {
    return null;
  }

  const adContent =
    selectedAd.type === "video" ? (
      <video
        className="entry-ad-media"
        src={selectedAd.src}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Advertisement"
      />
    ) : (
      <img
        className="entry-ad-media"
        src={selectedAd.src}
        alt="Advertisement"
      />
    );

  return (
    <div className="entry-ad-overlay" role="dialog" aria-modal="true">
      <div className="entry-ad-window">
        {canClose && (
          <button
            type="button"
            className="entry-ad-close"
            onClick={closeAd}
            aria-label="Close advertisement"
          >
            ×
          </button>
        )}

        <div className="entry-ad-label">Advertisement</div>

        {selectedAd.link ? (
          <a
            className="entry-ad-media-link"
            href={selectedAd.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {adContent}
          </a>
        ) : (
          <div className="entry-ad-media-link">{adContent}</div>
        )}

        {selectedAd.link && (
          <a
            className="entry-ad-click-button"
            href={selectedAd.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            CLICK ME
          </a>
        )}

        {!canClose && (
          <div className="entry-ad-wait-message">
            You can close this ad in a few seconds
          </div>
        )}
      </div>
    </div>
  );
}