import { useState, useEffect } from "react";
import {
  Download,
  Link,
  Music,
  Play,
  Pause,
  Volume2,
  Mic,
  Scissors,
  Loader,
} from "lucide-react";
import "../styles/Mp3Converter.css";
import { Helmet } from "react-helmet-async";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export default function Mp3Converter() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [effects, setEffects] = useState({
    volume: 100,
    pitch: 0,
    voice: "Original",
    trimStart: 0,
    trimEnd: 100,
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
      if (data.success) setPreview(data);
      else setError(data.error || "Failed to fetch audio info");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAudioVolume = (v) => Math.min(1, v / 100);
  const getPlaybackRate = () => {
    if (effects.voice === "Chipmunk") return 1.5;
    if (effects.voice === "Deep") return 0.7;
    return Math.min(4, Math.max(0.25, Math.pow(2, effects.pitch / 12)));
  };

  const playAudio = () => {
    if (!preview?.audio_url) return;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    const audio = new Audio(preview.audio_url);
    audio.volume = getAudioVolume(effects.volume);
    audio.playbackRate = getPlaybackRate();
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setError("Failed to play audio preview");
      setIsPlaying(false);
    };
    audio.play().catch(() => {
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

  const togglePlay = () => (isPlaying ? stopAudio() : playAudio());

  useEffect(() => {
    if (audioElement && isPlaying) {
      audioElement.volume = Math.min(
        1,
        Math.max(0, getAudioVolume(effects.volume))
      );
      audioElement.playbackRate = getPlaybackRate();
    }
  }, [effects.volume, effects.pitch, effects.voice]);

  const [pasteHint, setPasteHint] = useState("");

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
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => ({}))).error || "Download failed"
        );
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

  const getVolumeDisplay = () =>
    effects.volume > 100
      ? `${effects.volume}% (Boosted - may distort)`
      : `${effects.volume}%`;

const handlePasteOrClear = async () => {
  if (url) {
    setUrl(""); setPreview(null); setError(null); setPasteHint("");
  } else {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setPasteHint("");
      if (text) {
        // trigger preview with the pasted text directly
        setLoading(true); setError(null); setPreview(null);
        try {
          const response = await fetch(`${API_BASE_URL}/mp3/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: text }),
          });
          const data = await response.json();
          if (data.success) setPreview(data);
          else setError(data.error || "Failed to fetch audio info");
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
      }
    } catch {
      setPasteHint("Use Ctrl+V to paste");
      setTimeout(() => setPasteHint(""), 3000);
    }
  }
};

  return (

    <>
<Helmet>
  <title>Video to MP3 Converter — SaveFlox | Extract Audio Free</title>
  <meta name="description" content="Convert TikTok, Instagram, Facebook, and Pinterest videos to MP3 audio for free. Extract audio instantly with SaveFlox MP3 converter." />
  <link rel="canonical" href="https://www.saveflox.com/mp3-converter" />
</Helmet>

<section className="mp3">
      <div className="mp3-content">
        <div className="mp3-icon">
          <Music size={28} />
        </div>

        <h1 className="mp3-heading">
          Video to <span>MP3 Converter</span>
        </h1>
        <p className="mp3-subtext">
          Extract audio from TikTok, Instagram, Facebook, Pinterest, and
          Snapchat videos
        </p>

        <div className="mp3-card">
          <div className="mp3-input-group">
            <div className="mp3-input-wrapper">
  <Link size={18} className="mp3-input-icon" />
  <input
    type="text"
    className="mp3-input"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    placeholder="Paste video URL here..."
    onKeyPress={(e) => e.key === "Enter" && fetchAudioPreview()}
  />
  <button className="mp3-paste-btn" onClick={handlePasteOrClear}>
    {url ? "Clear" : "Paste"}
  </button>
</div>
            <button
              className="mp3-btn"
              onClick={fetchAudioPreview}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Preview"}
            </button>
          </div>
        </div>

        {pasteHint && <p className="mp3-paste-hint">{pasteHint}</p>}

        {loading && (
          <div className="mp3-dots-loader">
            <span />
            <span />
            <span />
          </div>
        )}

        {preview && (
          <div className="mp3-editor">
            <div className="preview-header">
              <img
                src={preview.thumbnail}
                alt="Preview"
                className="preview-thumbnail"
              />
              <div className="preview-info">
                <h3>{preview.title}</h3>
                <p>
                  {preview.uploader} • {preview.duration}
                </p>
                <button className="mp3-preview-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? "Pause Preview" : "Play Preview"}
                </button>
              </div>
            </div>

            <h2 className="mp3-editor-title">Audio Effects (Live Preview)</h2>

            <div className="mp3-control">
              <label className="mp3-control-label">
                <Volume2 size={16} /> Volume: {getVolumeDisplay()}
              </label>
              <div className="mp3-slider-row">
                <input
                  type="range"
                  className="mp3-slider"
                  min="0"
                  max="200"
                  value={effects.volume}
                  onChange={(e) =>
                    setEffects({ ...effects, volume: parseInt(e.target.value) })
                  }
                />
                <small className="mp3-hint">
                  100% = normal, 200% = double volume (may cause distortion)
                </small>
              </div>
            </div>

            <div className="mp3-control">
              <label className="mp3-control-label">
                <Mic size={16} /> Pitch: {effects.pitch} semitones
              </label>
              <div className="mp3-slider-row">
                <input
                  type="range"
                  className="mp3-slider"
                  min="-12"
                  max="12"
                  step="1"
                  value={effects.pitch}
                  onChange={(e) =>
                    setEffects({ ...effects, pitch: parseInt(e.target.value) })
                  }
                />
                <small className="mp3-hint">
                  -12 = lower, +12 = higher pitch
                </small>
              </div>
            </div>

            <div className="mp3-control">
              <label className="mp3-control-label">
                <Mic size={16} /> Voice Effect
              </label>
              <div className="mp3-voice-row">
                {["Original", "Chipmunk", "Deep", "Robot"].map((v) => (
                  <button
                    key={v}
                    className={`mp3-voice-pill ${
                      effects.voice === v ? "active" : ""
                    }`}
                    onClick={() => setEffects({ ...effects, voice: v })}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mp3-control">
              <label className="mp3-control-label">
                <Scissors size={16} /> Trim (Preview only)
              </label>
              <div className="mp3-slider-row">
                <small className="mp3-hint">Start: {effects.trimStart}%</small>
                <input
                  type="range"
                  className="mp3-slider"
                  min="0"
                  max={Math.max(1, effects.trimEnd - 1)}
                  value={effects.trimStart}
                  onChange={(e) =>
                    setEffects({
                      ...effects,
                      trimStart: parseInt(e.target.value),
                    })
                  }
                />
                <small className="mp3-hint">End: {effects.trimEnd}%</small>
                <input
                  type="range"
                  className="mp3-slider"
                  min={Math.min(99, effects.trimStart + 1)}
                  max="100"
                  value={effects.trimEnd}
                  onChange={(e) =>
                    setEffects({
                      ...effects,
                      trimEnd: parseInt(e.target.value),
                    })
                  }
                />
                <small className="mp3-hint">
                  Trim only affects preview playback, not the downloaded file
                </small>
              </div>
            </div>

            <div className="mp3-actions">
              <button className="mp3-preview-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? "Pause" : "Play Preview"}
              </button>
              <button
                className="mp3-download-btn"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader size={18} className="mp3-spinner" />
                ) : (
                  <Download size={18} />
                )}
                {downloading ? "Downloading..." : "Download Audio"}
              </button>
            </div>
          </div>
        )}

        {error && <div className="mp3-error">❌ {error}</div>}
      </div>
    </section>
    </>
  );
}
