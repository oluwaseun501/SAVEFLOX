import { useState, useRef, useEffect } from "react";
import { Download, Link, Music, Play, Pause, Volume2, Mic, Scissors, Loader } from "lucide-react";
import "../styles/Mp3Converter.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Mp3Converter() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [effects, setEffects] = useState({
    volume: 100,      // UI range 0-200%
    pitch: 0,
    voice: "Original",
    trimStart: 0,
    trimEnd: 100
  });

  const fetchAudioPreview = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mp3/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data);
      } else {
        setError(data.error || "Failed to fetch audio info");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convert UI volume (0-200) to audio volume (0-1)
  const getAudioVolume = (uiVolume) => {
    return Math.min(1, uiVolume / 100);
  };

  const getPlaybackRate = () => {
    let rate = Math.pow(2, effects.pitch / 12);
    if (effects.voice === "Chipmunk") {
      rate = 1.5;
    } else if (effects.voice === "Deep") {
      rate = 0.7;
    }
    return Math.min(4, Math.max(0.25, rate)); // Clamp between 0.25 and 4
  };

  const playAudio = () => {
    if (!preview || !preview.audio_url) return;
    
    // Stop any existing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    // Create audio element
    const audio = new Audio(preview.audio_url);
    
    // Set volume (clamped to 0-1 range)
    const audioVolume = getAudioVolume(effects.volume);
    audio.volume = audioVolume;
    
    // Set playback rate
    audio.playbackRate = getPlaybackRate();
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      setError("Failed to play audio preview");
      setIsPlaying(false);
    };
    
    audio.play().catch(err => {
      console.error("Play failed:", err);
      setError("Cannot play audio. Your browser may block autoplay.");
      setIsPlaying(false);
    });
    
    setAudioElement(audio);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Update audio properties when effects change (while playing)
  useEffect(() => {
    if (audioElement && isPlaying) {
      // Volume: clamp to valid range (0-1)
      const audioVolume = getAudioVolume(effects.volume);
      audioElement.volume = Math.min(1, Math.max(0, audioVolume));
      
      // Playback rate: clamp to valid range (0.25-4)
      audioElement.playbackRate = getPlaybackRate();
    }
  }, [effects.volume, effects.pitch, effects.voice, audioElement, isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, [audioElement]);

  const handleDownload = async () => {
    if (!url) return;

    setDownloading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mp3/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Download failed");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "audio.m4a";
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
    } catch (err) {
      setError(err.message || "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Display volume percentage with clamp note
  const getVolumeDisplay = () => {
    if (effects.volume > 100) {
      return `${effects.volume}% (Boosted - may distort)`;
    }
    return `${effects.volume}%`;
  };

  return (
    <section className="mp3-converter">
      <div className="mp3-content">
        <div className="mp3-icon">
          <Music size={28} />
        </div>

        <h1>YouTube to <span>MP3 Converter</span></h1>
        <p>Extract audio from YouTube, TikTok, Instagram videos</p>

        <div className="mp3-card">
          <div className="input-group">
            <Link size={18} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here..."
              onKeyPress={(e) => e.key === 'Enter' && fetchAudioPreview()}
            />
            <button onClick={fetchAudioPreview} disabled={loading}>
              {loading ? <Loader size={18} className="spinner" /> : "Preview"}
            </button>
          </div>
        </div>

        {preview && (
          <div className="mp3-preview">
            <div className="preview-header">
              <img src={preview.thumbnail} alt="Preview" />
              <div>
                <h3>{preview.title}</h3>
                <p>{preview.uploader} • {preview.duration}</p>
                <div className="audio-controls">
                  <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    {isPlaying ? "Pause Preview" : "Play Preview"}
                  </button>
                </div>
              </div>
            </div>

            <div className="effects-panel">
              <h3>Audio Effects (Live Preview)</h3>
              
              <div className="effect-control">
                <label><Volume2 size={16} /> Volume: {getVolumeDisplay()}</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={effects.volume}
                  onChange={(e) => setEffects({...effects, volume: parseInt(e.target.value)})}
                />
                <small className="effect-note">100% = normal, 200% = double volume (may cause distortion)</small>
              </div>

              <div className="effect-control">
                <label><Mic size={16} /> Pitch: {effects.pitch} semitones</label>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={effects.pitch}
                  onChange={(e) => setEffects({...effects, pitch: parseInt(e.target.value)})}
                />
                <small className="effect-note">-12 = lower, +12 = higher pitch</small>
              </div>

              <div className="effect-control">
                <label><Mic size={16} /> Voice Effect</label>
                <div className="voice-buttons">
                  {["Original", "Chipmunk", "Deep", "Robot"].map(v => (
                    <button
                      key={v}
                      className={effects.voice === v ? "active" : ""}
                      onClick={() => setEffects({...effects, voice: v})}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="effect-control">
                <label><Scissors size={16} /> Trim (Preview only)</label>
                <div className="trim-controls">
                  <span>Start: {effects.trimStart}%</span>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(1, effects.trimEnd - 1)}
                    value={effects.trimStart}
                    onChange={(e) => setEffects({...effects, trimStart: parseInt(e.target.value)})}
                  />
                  <span>End: {effects.trimEnd}%</span>
                  <input
                    type="range"
                    min={Math.min(99, effects.trimStart + 1)}
                    max="100"
                    value={effects.trimEnd}
                    onChange={(e) => setEffects({...effects, trimEnd: parseInt(e.target.value)})}
                  />
                </div>
                <small className="effect-note">Note: Trim only affects preview playback, not downloaded file</small>
              </div>
            </div>

            <button 
              className="download-btn" 
              onClick={handleDownload} 
              disabled={downloading}
            >
              <Download size={18} />
              {downloading ? "Downloading..." : "Download Audio"}
            </button>
          </div>
        )}

        {error && <div className="error">❌ {error}</div>}
      </div>
    </section>
  );
}