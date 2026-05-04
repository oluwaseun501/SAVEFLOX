import { useState } from "react";
import { Download, Link, Music, Scissors, Mic, Volume2, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/Mp3Converter.css";
import AdSlot from "./AdSlot";
import WhyChoose from "./WhyChoose";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";

export default function Mp3Converter() {
  const { t } = useTranslation();
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

  const voices = [
    { key: "Original", label: t("voice_original") },
    { key: "Male",     label: t("voice_male") },
    { key: "Female",   label: t("voice_female") },
    { key: "Chipmunk", label: t("voice_chipmunk") },
    { key: "Deep",     label: t("voice_deep") },
    { key: "Robot",    label: t("voice_robot") },
  ];

  return (
    <>
    <section className="mp3">
      <div className="mp3-content">
        {/* Icon */}
        <div className="mp3-icon">
          <Music size={28} />
        </div>

        {/* Heading */}
        <h1 className="mp3-heading">
          {t("mp3_heading")} <span>{t("mp3_highlight")}</span>
        </h1>

        {/* Subtext */}
        <p className="mp3-subtext">
          {t("mp3_subtext")}
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
                placeholder={t("mp3_placeholder")}
                className="mp3-input"
              />
            </div>
            <button className="mp3-btn" onClick={handleConvert}>
              <Music size={18} />
              {t("mp3_convert")}
            </button>
          </div>

          {/* Quality row */}
          <div className="mp3-options">
            <span className="mp3-options-label">{t("mp3_quality")}:</span>
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
            <h2 className="mp3-editor-title">{t("mp3_edit_title")}</h2>

            {/* Trim */}
            <div className="mp3-control">
              <label className="mp3-control-label">
                <Scissors size={16} />
                {t("mp3_trim")} ({trimStart}s – {trimEnd}s)
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
                {t("mp3_volume")} ({volume}%)
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
                {t("mp3_pitch")} ({pitch > 0 ? `+${pitch}` : pitch} {t("mp3_pitch_unit")})
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
                {t("mp3_voice_effect")}
              </label>
              <div className="mp3-voice-row">
                {voices.map((v) => (
                  <button
                    key={v.key}
                    className={`mp3-voice-pill ${voice === v.key ? "active" : ""}`}
                    onClick={() => setVoice(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action row */}
            <div className="mp3-actions">
              <button className="mp3-preview-btn">
                <Play size={16} />
                {t("mp3_preview")}
              </button>
              <button className="mp3-download-btn" onClick={handleDownload}>
                <Download size={18} />
                {t("mp3_download")}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>

    
      <AdSlot slot="Mp3Converter-top" format="leaderboard" />

      <WhyChoose />
      <AdSlot slot="Mp3Converter-bottom" format="leaderboard" />
      <HowItWorks />
      <AdSlot slot="Mp3Converter-bottom" format="leaderboard" />
      <FAQ />

    </>
  );
}