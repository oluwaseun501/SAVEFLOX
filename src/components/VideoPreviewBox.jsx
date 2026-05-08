import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../styles/VideoPreviewBox.css";

export default function VideoPreviewBox({ platform, onResolutionSelect, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Platform-specific resolutions
  const resolutions = {
    tiktok: ["1080p", "720p", "480p"],
    instagram: ["1080p", "720p", "480p"],
    facebook: ["1080p", "720p", "480p"],
    twitter: ["720p", "480p", "360p"],
    youtube: ["4K", "1080p", "720p", "480p", "360p"],
    pinterest: ["1080p", "720p", "480p"],
  };

  const availableResolutions = resolutions[platform?.toLowerCase()] || ["720p", "480p"];

  return (
    <div className="video-preview-box">
      <div className="preview-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="preview-title">
          <span className="preview-icon">🎥</span>
          Video Preview
          <span className="preview-platform">{platform || "Platform"}</span>
        </div>
        <button className="preview-toggle">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="preview-content">
          <div className="preview-video-placeholder">
            <div className="placeholder-icon">📹</div>
            <p>Video Preview</p>
          </div>

          <div className="preview-info">
            <p className="info-label">Available Resolutions:</p>
            <div className="resolution-buttons">
              {availableResolutions.map((res) => (
                <button
                  key={res}
                  className="resolution-btn"
                  onClick={() => onResolutionSelect(res)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : res}
                </button>
              ))}
            </div>
          </div>

          <div className="preview-note">
            ℹ️ Your download will be processed by our servers and ready to download in a few seconds.
          </div>
        </div>
      )}
    </div>
  );
}
