import { useState } from "react";
import { Download, Link, Music, Scissors, Mic, Volume2, Play } from "lucide-react";
import "../styles/Mp3Converter.css";

export default function Mp3Converter() {
  const [url, setUrl] = useState("");
  const [converted, setConverted] = useState(false);
  const [quality, setQuality] = useState("320 kbps");

  // Editing controls
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [volume, setVolume] = useState(100);
  const [pitch, setPitch] = useState(0);
  const [voice, setVoice] = useState("Original");

  const handleConvert = () => {
    if (!url) return;
    console.log("Converting to MP3:", url);
    setConverted(true);
  };

  const handleDownload = () => {
    console.log("Download MP3", { quality, trimStart, trimEnd, volume, pitch, voice });
  };

  return (
    <section className="mp3">
      <div className="mp3-content">
        {/* Icon */}
        <div className="mp3-icon">
          <Music size={28} />
        </div>

        {/* Heading */}
        <h1 className="mp3-heading">
          Convert Video to <span>MP3</span>
        </h1>

        {/* Subtext */}
        <p className="mp3-subtext">
          Paste any video link, convert it to high-quality MP3, edit the sound,
          change the voice, and download — all in one place.
        </p>

        {/* Converter Card */}
        <div className="mp3-card">
          {/* Input + Button */}
          <div className="mp3-input-group">
            <div className="mp3-input-wrapper">
              <Link size={18} className="mp3-input-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video link here (TikTok, YouTube, Instagram...)"
                className="mp3-input"
              />
            </div>
            <button className="mp3-btn" onClick={handleConvert}>
              <Music size={18} />
              Convert
            </button>
          </div>

          {/* Quality row */}
          <div className="mp3-options">
            <span className="mp3-options-label">Quality:</span>
            <select
              className="mp3-quality-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option>320 kbps</option>
              <option>256 kbps</option>
              <option>192 kbps</option>
              <option>128 kbps</option>
            </select>
          </div>
        </div>

        {/* Editor Panel - shown after convert */}
        {converted && (
          <div className="mp3-editor">
            <h2 className="mp3-editor-title">Edit your MP3</h2>

            {/* Trim */}
            <div className="mp3-control">
              <label className="mp3-control-label">
                <Scissors size={16} />
                Trim ({trimStart}s – {trimEnd}s)
              </label>
              <div className="mp3-slider-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trimStart}
                  onChange={(e) =>
                    setTrimStart(Math.min(Number(e.target.value), trimEnd - 1))
                  }
                  className="mp3-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trimEnd}
                  onChange={(e) =>
                    setTrimEnd(Math.max(Number(e.target.value), trimStart + 1))
                  }
                  className="mp3-slider"
                />
              </div>
            </div>

            {/* Volume */}
            <div className="mp3-control">
              <label className="mp3-control-label">
                <Volume2 size={16} />
                Volume ({volume}%)
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="mp3-slider"
              />
            </div>

            {/* Pitch */}
            <div className="mp3-control">
              <label className="mp3-control-label">
                <Mic size={16} />
                Pitch ({pitch > 0 ? `+${pitch}` : pitch} semitones)
              </label>
              <input
                type="range"
                min="-12"
                max="12"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="mp3-slider"
              />
            </div>

            {/* Voice */}
            <div className="mp3-control">
              <label className="mp3-control-label">
                <Mic size={16} />
                Voice Effect
              </label>
              <div className="mp3-voice-row">
                {["Original", "Male", "Female", "Chipmunk", "Deep", "Robot"].map(
                  (v) => (
                    <button
                      key={v}
                      className={`mp3-voice-pill ${
                        voice === v ? "active" : ""
                      }`}
                      onClick={() => setVoice(v)}
                    >
                      {v}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Action row */}
            <div className="mp3-actions">
              <button className="mp3-preview-btn">
                <Play size={16} />
                Preview
              </button>
              <button className="mp3-download-btn" onClick={handleDownload}>
                <Download size={18} />
                Download MP3
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}