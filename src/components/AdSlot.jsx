import "../styles/AdSlot.css";
import { useAds } from "../context/AdsContext";

export default function AdSlot({ slot = "default", format = "leaderboard", label, image, link }) {
  const { adsEnabled } = useAds();
  if (!adsEnabled) return null;

  return (
    <div className="ad-slot-section">
      <div className={`ad-slot ad-${format}`} data-slot={slot}>
        {image ? (
          <a
            className="ad-image-link"
            href={link || "#"}
            target={link ? "_blank" : undefined}
            rel={link ? "noopener noreferrer" : undefined}
            onClick={!link ? (e) => e.preventDefault() : undefined}
          >
            <img src={image} alt="Advertisement" className="ad-image" />
            <span className="ad-image-badge">Ad</span>
          </a>
        ) : (
          <div className="ad-placeholder">
            <span className="ad-placeholder-label">{label || "Advertisement"}</span>
            <span className="ad-placeholder-slot">slot: {slot}</span>
          </div>
        )}
      </div>
    </div>
  );
}