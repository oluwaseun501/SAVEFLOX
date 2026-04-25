import "../styles/AdSlot.css";
import { useAds } from "../context/AdsContext";

/**
 * Reusable ad placement.
 *
 * Props:
 *  - slot:   unique id for this placement (e.g. "home-top", "tiktok-bottom")
 *  - format: visual size — "leaderboard" (wide), "banner" (medium), "rectangle" (square-ish)
 *  - label:  optional override for the placeholder text
 *
 * When your ads are ready, just paste your ad-network code
 * (Google AdSense, Ezoic, etc.) inside the marked block below.
 * Every page that uses <AdSlot /> will start showing the real ad immediately.
 */
export default function AdSlot({ slot = "default", format = "leaderboard", label }) {
  const { adsEnabled } = useAds();
if (!adsEnabled) return null;

  return (
    
    <div className={`ad-slot ad-${format}`} data-slot={slot}>
      {/* ====== REAL AD GOES HERE ======
          Example AdSense snippet:

          <ins className="adsbygoogle"
               style={{ display: "block" }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>

          Until then, the placeholder below is shown.            */}
      <div className="ad-placeholder">
        <span className="ad-placeholder-label">{label || "Advertisement"}</span>
        <span className="ad-placeholder-slot">slot: {slot}</span>
      </div>
    </div>
  );
}