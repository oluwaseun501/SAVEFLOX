import "../styles/AdSlot.css";
import { useAds } from "../context/AdsContext";
import { supabase } from "../lib/supabase";
import { useAdRotation } from "../hooks/useAdRotation"; 

async function trackAdClick(slot, link) {
  try {
    await supabase.from("ad_clicks").insert({ slot, link });
  } catch (err) {
    // silent fail
  }
}

export default function AdSlot({ slot = "default", format = "leaderboard", label, image, link }) {
  const { adsEnabled } = useAds();
  const rotatedAd = useAdRotation(slot); //

  if (!adsEnabled) return null;

  // Use rotated ad if available, otherwise fall back to manually passed props
  const activeImage = rotatedAd?.image || image;
  const activeLink  = rotatedAd?.link  || link;

  function handleClick() {
    trackAdClick(slot, activeLink || "none");
  }

  return (
    <div className="ad-slot-section">
      <div className={`ad-slot ad-${format}`} data-slot={slot}>
        {activeImage ? (
          <a
            className="ad-image-link"
            href={activeLink || "#"}
            target={activeLink ? "_blank" : undefined}
            rel={activeLink ? "noopener noreferrer" : undefined}
            onClick={handleClick}
          >
            <img src={activeImage} alt="Advertisement" className="ad-image" />
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