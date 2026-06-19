import "../styles/AdSlot.css";
import { useAds } from "../context/AdsContext";
import { supabase } from "../lib/supabase";

async function trackAdClick(slot, link) {
  try {
    await supabase.from("ad_clicks").insert({ slot, link });
  } catch (err) {
    // silent fail
  }
}

export default function AdSlot({ slot = "default", format = "leaderboard", label, image, link }) {
  const { adsEnabled } = useAds();
  if (!adsEnabled) return null;

  function handleClick() {
    trackAdClick(slot, link || "none");
  }

  return (
    <div className="ad-slot-section">
      <div className={`ad-slot ad-${format}`} data-slot={slot}>
        {image ? (
          <a
            className="ad-image-link"
            href={link || "#"}
            target={link ? "_blank" : undefined}
            rel={link ? "noopener noreferrer" : undefined}
            onClick={handleClick}
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