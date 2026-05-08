import { useState, useEffect } from "react";
import { Download, X, AlertCircle } from "lucide-react";
import "../styles/VideoPreviewModal.css";

export default function VideoPreviewModal({
  isOpen,
  videoUrl,
  platform,
  onClose,
  onDownload,
  loading = false,
}) {
  const [selectedResolution, setSelectedResolution] = useState("720p");
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Fetch video metadata when modal opens
  useEffect(() => {
    if (isOpen && videoUrl) {
      fetchVideoInfo();
    }
  }, [isOpen, videoUrl]);

  const fetchVideoInfo = async () => {
    try {
      setLoadingInfo(true);
      setVideoInfo(null);
      
      // Try to extract video ID and get metadata
      // This is a simple implementation - in production you'd want platform-specific handlers
      const videoData = {
        title: "Video from " + platform.charAt(0).toUpperCase() + platform.slice(1),
        url: videoUrl,
        platform: platform,
        // In a real app, you'd fetch actual metadata here
        // For now, we'll show basic info
      };
      
      setVideoInfo(videoData);
    } catch (err) {
      console.error("Error fetching video info:", err);
      setVideoInfo(null);
    } finally {
      setLoadingInfo(false);
    }
  };

  // Video resolutions available for each platform
  const resolutionsByPlatform = {
    tiktok: ["1080p", "720p", "480p"],
    instagram: ["1080p", "720p", "480p"],
    facebook: ["1080p", "720p", "480p"],
    twitter: ["720p", "480p", "360p"],
    pinterest: ["1080p", "720p", "480p"],
    youtube: ["4K", "1080p", "720p", "480p", "360p"],
  };

  const resolutions = resolutionsByPlatform[platform] || ["720p", "480p"];

  const handleDownload = () => {
    if (!selectedResolution) {
      setError("Please select a resolution");
      return;
    }
    onDownload(selectedResolution);
    handleClose();
  };

  const handleClose = () => {
    setError("");
    setSelectedResolution(resolutions[0]);
    setVideoInfo(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="video-preview-overlay" onClick={handleClose}>
      <div className="video-preview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="video-preview-header">
          <h2>Preview & Download</h2>
          <button
            className="close-btn"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="video-preview-content">
          {/* Video Thumbnail */}
          <div className="video-thumbnail-container">
            <div className="video-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <p>
                {loadingInfo ? "Loading video info..." : "Ready to download"}
              </p>
            </div>
          </div>

          {/* Video Info */}
          <div className="video-info">
            <div className="info-row">
              <span className="info-label">Platform:</span>
              <span className="info-value">{platform.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Resolution:</span>
              <span className="info-value">Up to {resolutions[0]}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Format:</span>
              <span className="info-value">MP4 Video</span>
            </div>
            {videoInfo && videoInfo.title && (
              <div className="info-row">
                <span className="info-label">Title:</span>
                <span className="info-value" title={videoInfo.title}>
                  {videoInfo.title.length > 40
                    ? `${videoInfo.title.substring(0, 37)}...`
                    : videoInfo.title}
                </span>
              </div>
            )}
          </div>

          {/* Resolution Selection */}
          <div className="resolution-section">
            <label className="section-label">Select Quality:</label>
            <div className="resolution-grid">
              {resolutions.map((res) => (
                <button
                  key={res}
                  className={`resolution-btn ${
                    selectedResolution === res ? "active" : ""
                  }`}
                  onClick={() => setSelectedResolution(res)}
                  disabled={loading}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Note */}
          <div className="download-note">
            <p>
              💡 Your download will be processed by our servers. You'll receive
              a download link once processing is complete.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="video-preview-footer">
          <button
            className="btn-cancel"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-download"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              <>
                <Download size={16} />
                Start Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
