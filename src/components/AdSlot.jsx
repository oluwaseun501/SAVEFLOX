import "../styles/AdSlot.css";
import { useAds } from "../context/AdsContext";

export default function AdSlot({ slot = "default", format = "leaderboard", label, image }) {
  const { adsEnabled } = useAds();
  if (!adsEnabled) return null;

  return (
      <div className="ad-slot-section">
    <div className={`ad-slot ad-${format}`} data-slot={slot}>
      {image ? (
        <a className="ad-image-link" href="#" onClick={(e) => e.preventDefault()}>
          <img src={image} alt="Advertisement" className="ad-image" />
          <span className="ad-image-badge">Ad</span>
        </a>
      ) : (
        /* ====== REAL AD GOES HERE ======
           Replace the placeholder below with your ad network snippet.
           Example AdSense:

           <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
           <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        */
        <div className="ad-placeholder">
          <span className="ad-placeholder-label">{label || "Advertisement"}</span>
          <span className="ad-placeholder-slot">slot: {slot}</span>
        </div>
      )}
    </div>
    </div>
  );
}