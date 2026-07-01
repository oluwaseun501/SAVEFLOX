import { useState, useEffect, useRef } from "react";
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
import { MP3ConverterSEO } from "./SEOComponents";
import { RelatedServices } from "./BreadcrumbsAndLinks";
// import adsBanner from "../ads/ads1.jpg";
// import adsBanner2 from "../ads/ads2.jpg";
import DownloadAdModal from "./DownloadAdModal";
import { useAdRotation } from "../hooks/useAdRotation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
const mountStyle = (delayMs) => ({ animation: `fadeSlideIn 0.8s ease-out ${delayMs}ms both` });

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function audioBufferToWav(buffer) {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const len = buffer.length;
  const ab = new ArrayBuffer(44 + len * numCh * 2);
  const view = new DataView(ab);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  str(0, "RIFF"); view.setUint32(4, 36 + len * numCh * 2, true);
  str(8, "WAVE"); str(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true); view.setUint32(24, sr, true);
  view.setUint32(28, sr * numCh * 2, true); view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true); str(36, "data");
  view.setUint32(40, len * numCh * 2, true);
  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(off, s * 0x7fff, true); off += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

function olaShift(audioBuffer, semitones) {
  if (semitones === 0) return audioBuffer;
  const ratio = Math.pow(2, semitones / 12);
  const sr = audioBuffer.sampleRate;
  const numCh = audioBuffer.numberOfChannels;
  const origLen = audioBuffer.length;
  const grainSamples = Math.floor(sr * 0.05);
  const hopIn = Math.floor(grainSamples / 2);
  const hann = new Float32Array(grainSamples);
  for (let i = 0; i < grainSamples; i++)
    hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / grainSamples);
  const processChannel = (src) => {
    const resLen = Math.round(origLen / ratio);
    const res = new Float32Array(resLen);
    for (let i = 0; i < resLen; i++) {
      const p = i * ratio, j = Math.floor(p), f = p - j;
      res[i] = (j < origLen ? src[j] : 0) * (1 - f) + (j + 1 < origLen ? src[j + 1] : 0) * f;
    }
    const outHop = Math.round(hopIn * (origLen / resLen));
    const out = new Float32Array(origLen);
    const norm = new Float32Array(origLen);
    let inPos = 0, outPos = 0;
    while (inPos + grainSamples <= resLen && outPos + grainSamples <= origLen) {
      for (let i = 0; i < grainSamples; i++) {
        out[outPos + i] += res[inPos + i] * hann[i];
        norm[outPos + i] += hann[i];
      }
      inPos += hopIn;
      outPos += outHop;
    }
    for (let i = 0; i < origLen; i++) if (norm[i] > 1e-4) out[i] /= norm[i];
    return out;
  };
  const tmp = new AudioContext();
  const outBuf = tmp.createBuffer(numCh, origLen, sr);
  for (let ch = 0; ch < numCh; ch++)
    outBuf.copyToChannel(processChannel(audioBuffer.getChannelData(ch)), ch);
  tmp.close();
  return outBuf;
}

const VOICE_SEMITONES = { Chipmunk: 7, Deep: -7 };

function applyVoiceGraph(ctx, inputNode, eff) {
  const gain = ctx.createGain();
  gain.gain.value = eff.volume / 100;
  const oscillators = [];
  switch (eff.voice) {
    case "Robot": {
      const osc = ctx.createOscillator();
      osc.type = "sine"; osc.frequency.value = 30;
      const rg = ctx.createGain(); rg.gain.value = 0;
      osc.connect(rg.gain); inputNode.connect(rg); rg.connect(gain);
      const dg = ctx.createGain(); dg.gain.value = 0.15;
      inputNode.connect(dg); dg.connect(gain);
      oscillators.push(osc);
      break;
    }
    case "Echo": {
      const delay = ctx.createDelay(1.0); delay.delayTime.value = 0.3;
      const fb = ctx.createGain(); fb.gain.value = 0.45;
      const wet = ctx.createGain(); wet.gain.value = 0.5;
      const dry = ctx.createGain(); dry.gain.value = 0.7;
      inputNode.connect(dry); inputNode.connect(delay);
      delay.connect(fb); fb.connect(delay); delay.connect(wet);
      dry.connect(gain); wet.connect(gain);
      break;
    }
    case "Telephone": {
      const hi = ctx.createBiquadFilter();
      hi.type = "highpass"; hi.frequency.value = 300; hi.Q.value = 0.7;
      const lo = ctx.createBiquadFilter();
      lo.type = "lowpass"; lo.frequency.value = 3400; lo.Q.value = 0.7;
      const crunch = ctx.createGain(); crunch.gain.value = 2.5;
      inputNode.connect(hi); hi.connect(lo); lo.connect(crunch); crunch.connect(gain);
      break;
    }
    case "Underwater": {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 400; filter.Q.value = 5;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 3;
      const lfoG = ctx.createGain(); lfoG.gain.value = 60;
      lfo.connect(lfoG); lfoG.connect(filter.frequency);
      oscillators.push(lfo);
      inputNode.connect(filter); filter.connect(gain);
      break;
    }
    default:
      inputNode.connect(gain);
  }
  gain.connect(ctx.destination);
  return { gainNode: gain, oscillators };
}

export default function Mp3Converter() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pasteHint, setPasteHint] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [adModal, setAdModal] = useState(null);
  const [pendingDownload, setPendingDownload] = useState(null);
    const popupImageAd = useAdRotation("popup-image");
  const popupVideoAd = useAdRotation("popup-video");

  const [effects, setEffects] = useState({
    volume: 100,
    pitch: 0,
    voice: "Original",
    trimStart: 0,
    trimEnd: 0,
  });

  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const oscillatorRefs = useRef([]);
  const blobCacheRef = useRef({});
  const bufferCacheRef = useRef({});
  const effectsRef = useRef(effects);

  useEffect(() => { effectsRef.current = effects; }, [effects]);

  useEffect(() => {
    if (audioDuration > 0 && effects.trimEnd === 0)
      setEffects((e) => ({ ...e, trimEnd: audioDuration }));
  }, [audioDuration]);

  useEffect(() => {
    setAudioDuration(0);
    setEffects((e) => ({ ...e, trimStart: 0, trimEnd: 0 }));
  }, [preview]);

  const stopAudio = () => {
    oscillatorRefs.current.forEach((o) => { try { o.stop(); } catch (_) {} });
    oscillatorRefs.current = [];
    if (sourceRef.current) { try { sourceRef.current.stop(); } catch (_) {} sourceRef.current = null; }
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null; }
    gainRef.current = null;
    setIsPlaying(false);
    setDebugInfo("");
  };

  const getDecodedBuffer = async () => {
    if (bufferCacheRef.current[url]) return bufferCacheRef.current[url];
    if (!blobCacheRef.current[url]) {
      const res = await fetch(`${API_BASE_URL}/mp3/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      blobCacheRef.current[url] = URL.createObjectURL(blob);
    }
    const resp = await fetch(blobCacheRef.current[url]);
    const arrayBuf = await resp.arrayBuffer();
    const tmpCtx = new AudioContext();
    const decoded = await tmpCtx.decodeAudioData(arrayBuf);
    await tmpCtx.close();
    bufferCacheRef.current[url] = decoded;
    return decoded;
  };

  const playAudio = async () => {
    if (!url) return;
    stopAudio();
    setError(null);
    const eff = effectsRef.current;
    const cached = !!bufferCacheRef.current[url];
    if (!cached) setDebugInfo("loading");
    let rawBuffer;
    try {
      rawBuffer = await getDecodedBuffer();
    } catch (e) {
      setError(`Could not load audio: ${e.message}`);
      setDebugInfo("");
      return;
    }
    if (audioDuration === 0) setAudioDuration(rawBuffer.duration);
    const semitones = VOICE_SEMITONES[eff.voice] ?? 0;
    const pitchedBuffer = semitones !== 0 ? olaShift(rawBuffer, semitones) : rawBuffer;
    setDebugInfo("Playing...");
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const source = ctx.createBufferSource();
      source.buffer = pitchedBuffer;
      sourceRef.current = source;
      const { gainNode, oscillators } = applyVoiceGraph(ctx, source, eff);
      gainRef.current = gainNode;
      oscillatorRefs.current = oscillators;
      oscillators.forEach((o) => o.start(0));
      const dur = rawBuffer.duration;
      const trimStart = Math.max(0, Math.min(eff.trimStart, dur));
      const trimEnd = eff.trimEnd > 0 ? Math.min(eff.trimEnd, dur) : dur;
      const trimDuration = Math.max(0.05, trimEnd - trimStart);
      source.onended = () => { setIsPlaying(false); setDebugInfo(""); };
      if (ctx.state === "suspended") await ctx.resume();
      source.start(0, trimStart, trimDuration);
      setIsPlaying(true);
    } catch (e) {
      setError(`Playback failed: ${e.message}`);
      setDebugInfo("");
      setIsPlaying(false);
    }
  };

  const togglePlay = () => (isPlaying ? stopAudio() : playAudio());

  useEffect(() => {
    if (!isPlaying || !gainRef.current) return;
    gainRef.current.gain.value = effects.volume / 100;
  }, [effects.volume, isPlaying]);

  useEffect(() => () => {
    stopAudio();
    Object.values(blobCacheRef.current).forEach(URL.revokeObjectURL);
  }, []);

  const fetchAudioPreview = async (overrideUrl) => {
    const targetUrl = overrideUrl ?? url;
    if (!targetUrl) { setError("Please enter a URL"); return; }
    setLoading(true); setError(null); setPreview(null); setDebugInfo(""); stopAudio();
    try {
      const res = await fetch(`${API_BASE_URL}/mp3/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.success) setPreview(data);
      else setError(data.error || "Failed to fetch audio info");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handlePasteOrClear = async () => {
    if (url) {
      setUrl(""); setPreview(null); setError(null); setPasteHint(""); setDebugInfo(""); stopAudio();
    } else {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text); setPasteHint("");
        if (text) fetchAudioPreview(text);
      } catch {
        setPasteHint("Use Ctrl+V to paste");
        setTimeout(() => setPasteHint(""), 3000);
      }
    }
  };

  // Clear blob cache after each download so the next download re-hits the
  // backend /mp3/download endpoint (which logs it). The decoded audio buffer
  // cache is kept so replays stay instant.
  const clearBlobCacheForLogging = () => {
    if (blobCacheRef.current[url]) {
      URL.revokeObjectURL(blobCacheRef.current[url]);
      delete blobCacheRef.current[url];
    }
  };

  // Download original — no effects, no popup
  const downloadOriginal = async () => {
    if (!url) return;
    setDownloading(true); setError(null);
    try {
      const rawBuffer = await getDecodedBuffer();
      const wavBlob = audioBufferToWav(rawBuffer);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = dlUrl;
      const title = (preview?.title || "audio").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      a.download = `${title}.wav`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(dlUrl);
      // Reset blob cache so the next download re-hits the backend (logs it)
      clearBlobCacheForLogging();
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Download with effects baked in
  const handleDownload = async () => {
    if (!url) return;
    setDownloading(true); setError(null);
    try {
      const rawBuffer = await getDecodedBuffer();
      const eff = effects;
      const semitones = VOICE_SEMITONES[eff.voice] ?? 0;
      const pitchedBuffer = semitones !== 0 ? olaShift(rawBuffer, semitones) : rawBuffer;
      const dur = rawBuffer.duration;
      const startSec = Math.max(0, Math.min(eff.trimStart, dur));
      const endSec = eff.trimEnd > 0 ? Math.min(eff.trimEnd, dur) : dur;
      const trimDuration = Math.max(0.05, endSec - startSec);
      const sr = pitchedBuffer.sampleRate;
      const numCh = pitchedBuffer.numberOfChannels;
      const echoTail = eff.voice === "Echo" ? 1.5 : 0;
      const outLen = Math.ceil((trimDuration + echoTail) * sr);
      const offCtx = new OfflineAudioContext(numCh, outLen, sr);
      const source = offCtx.createBufferSource();
      source.buffer = pitchedBuffer;
      const { oscillators } = applyVoiceGraph(offCtx, source, eff);
      oscillators.forEach((o) => o.start(0));
      source.start(0, startSec, trimDuration);
      const rendered = await offCtx.startRendering();
      const wavBlob = audioBufferToWav(rendered);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = dlUrl;
      const title = (preview?.title || "audio").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
      a.download = `${title}_modified.wav`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(dlUrl);
      // Reset blob cache so the next download re-hits the backend (logs it)
      clearBlobCacheForLogging();
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const maxTrim = audioDuration || (preview?.duration_seconds || 300);
  const activeVoiceSemitones = VOICE_SEMITONES[effects.voice];

  // Check if user has changed any effect from default
  const isEdited =
    effects.volume !== 100 ||
    effects.voice !== "Original" ||
    effects.trimStart !== 0 ||
    (effects.trimEnd > 0 && effects.trimEnd !== audioDuration);

  return (
    <>
      {MP3ConverterSEO()}
      <Helmet>
        <title>Video to MP3 Converter — SaveFlox | Extract Audio Free</title>
        <meta name="description" content="Convert TikTok, Instagram, Facebook, and Pinterest videos to MP3 audio for free." />
        <link rel="canonical" href="https://www.saveflox.com/mp3-converter" />
      </Helmet>

      <section className="mp3">
        <div className="mp3-content">
          <div className="mp3-icon" style={mountStyle(0)}><Music size={28} /></div>
          <h1 className="mp3-heading" style={mountStyle(150)}>Video to <span>MP3 Converter</span></h1>
          <p className="mp3-subtext" style={mountStyle(300)}>
            Extract audio from TikTok, Instagram, Facebook, Pinterest, and Snapchat videos
          </p>

          <div className="mp3-card" style={mountStyle(0)}>
            <div className="mp3-input-group">
              <div className="mp3-input-wrapper">
                <Link size={18} className="mp3-input-icon" />
                <input type="text" className="mp3-input" value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here..."
                  onKeyPress={(e) => e.key === "Enter" && fetchAudioPreview()} />
                <button className="mp3-paste-btn" onClick={handlePasteOrClear}>
                  {url ? "Clear" : "Paste"}
                </button>
              </div>
              <button className="mp3-btn" onClick={() => fetchAudioPreview()} disabled={loading}>
                {loading ? "Please wait..." : "Preview"}
              </button>
            </div>
          </div>

          {pasteHint && <p className="mp3-paste-hint">{pasteHint}</p>}
          {loading && <div className="mp3-dots-loader"><span /><span /><span /></div>}

          {preview && (
            <div className="mp3-editor" style={mountStyle(0)}>
              <div className="preview-header">
                <img src={preview.thumbnail} alt="Preview" className="preview-thumbnail" />
                <div className="preview-info">
                  <h3>{preview.title}</h3>
                  <p>{preview.uploader} • {preview.duration}</p>
                  <button className="mp3-preview-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? "Pause Preview" : "Play Preview"}
                  </button>
                </div>
              </div>

              {debugInfo === "loading" && (
                <div className="mp3-loading-bar">
                  <svg className="mp3-loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="mp3-loading-track"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="mp3-loading-arc"/>
                  </svg>
                  <div>
                    <div className="mp3-loading-title">Preparing audio…</div>
                    <div className="mp3-loading-sub">First play only — replays are instant</div>
                  </div>
                </div>
              )}
              {debugInfo && debugInfo !== "loading" && (
                <p className="mp3-status-text">✓ {debugInfo}</p>
              )}

              <h2 className="mp3-editor-title">Audio Effects (Live Preview)</h2>

              {/* Volume */}
              <div className="mp3-control">
                <label className="mp3-control-label">
                  <Volume2 size={16} /> Volume: {effects.volume > 100 ? `${effects.volume}% (Boosted)` : `${effects.volume}%`}
                </label>
                <div className="mp3-slider-row">
                  <input type="range" className="mp3-slider" min="0" max="200" value={effects.volume}
                    onChange={(e) => setEffects({ ...effects, volume: parseInt(e.target.value) })} />
                  <small className="mp3-hint">100% = normal · 200% = double volume (may distort)</small>
                </div>
              </div>

              {/* Voice Effect */}
              <div className="mp3-control">
                <label className="mp3-control-label"><Mic size={16} /> Voice Effect</label>
                <div className="mp3-voice-row">
                  {[
                    { id: "Original",   label: "Original",   hint: "No effect" },
                    { id: "Chipmunk",   label: "Chipmunk",   hint: "Higher pitch, same speed" },
                    { id: "Deep",       label: "Deep",       hint: "Lower pitch, same speed" },
                    { id: "Robot",      label: "Robot",      hint: "Ring modulator" },
                    { id: "Echo",       label: "Echo",       hint: "Delay + feedback" },
                    { id: "Telephone",  label: "Telephone",  hint: "Bandpass filter" },
                    { id: "Underwater", label: "Underwater", hint: "Lowpass + wobble" },
                  ].map(({ id, label, hint }) => (
                    <button key={id} title={hint}
                      className={`mp3-voice-pill ${effects.voice === id ? "active" : ""}`}
                      onClick={() => { setEffects({ ...effects, voice: id }); if (isPlaying) stopAudio(); }}>
                      {label}
                    </button>
                  ))}
                </div>
                {activeVoiceSemitones !== undefined && (
                  <small className="mp3-hint mp3-voice-confirm">
                    Pitch only changes — tempo/speed stays the same ✓
                  </small>
                )}
                {isPlaying && (
                  <small className="mp3-hint mp3-voice-warn">
                    Voice changed — press Play again to hear the new effect
                  </small>
                )}
              </div>

              {/* Trim */}
              <div className="mp3-control">
                <label className="mp3-control-label">
                  <Scissors size={16} /> Trim
                  {audioDuration > 0 && (
                    <span className="mp3-trim-range">
                      {fmt(effects.trimStart)} → {fmt(effects.trimEnd || audioDuration)}
                      {" "}<span className="mp3-trim-clip">
                        (clip: {fmt((effects.trimEnd || audioDuration) - effects.trimStart)})
                      </span>
                    </span>
                  )}
                </label>
                <div className="mp3-slider-row">
                  <div className="mp3-trim-times">
                    <span>Start: {fmt(effects.trimStart)}</span>
                    <span>End: {fmt(effects.trimEnd || maxTrim)}</span>
                  </div>
                  <input type="range" className="mp3-slider"
                    min="0" max={maxTrim} step="1" value={effects.trimStart}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setEffects({ ...effects, trimStart: Math.min(v, (effects.trimEnd || maxTrim) - 1) });
                    }} />
                  <input type="range" className="mp3-slider"
                    min="0" max={maxTrim} step="1" value={effects.trimEnd || maxTrim}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setEffects({ ...effects, trimEnd: Math.max(v, effects.trimStart + 1) });
                    }} />
                  <small className="mp3-hint">Applies to both preview and downloaded file</small>
                </div>
              </div>

              {/* Actions */}
              <div className="mp3-actions">
                <button className="mp3-preview-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? "Pause" : "Play Preview"}
                </button>

                {/* Original download — straight to download, no popup */}
                <button className="mp3-download-btn" onClick={downloadOriginal} disabled={downloading}>
                  {downloading ? <Loader size={18} className="mp3-spinner" /> : <Download size={18} />}
                  {downloading ? "Processing…" : "Download Original MP3"}
                </button>

                {/* Edited download — shows image ad popup if effects were changed */}
                <button
                  className="mp3-download-btn"
                  style={{ background: isEdited ? "var(--primary, #7c3aed)" : undefined }}
                  onClick={() => {
                    if (isEdited) {
                      setPendingDownload(() => handleDownload);
                      setAdModal("edited");
                    } else {
                      handleDownload();
                    }
                  }}
                  disabled={downloading}
                >
                  {downloading ? <Loader size={18} className="mp3-spinner" /> : <Download size={18} />}
                  {downloading ? "Processing…" : "Download Edited Audio"}
                  {isEdited && <span className="dl-hd-badge">EDITED</span>}
                </button>
              </div>

              {downloading && (
                <p className="mp3-downloading-msg">
                  Rendering audio with effects — this may take a few seconds…
                </p>
              )}
            </div>
          )}

          {error && <div className="mp3-error" style={mountStyle(0)}>❌ {error}</div>}
        </div>
      </section>

      <RelatedServices currentPage="/mp3" />

      {adModal === "edited" && (
        <DownloadAdModal
        page="mp3"
          type="image"
           adImage={popupImageAd?.image}   
            backlink={popupImageAd?.link} 
          skipDelay={5}
          
          onSkip={() => {
            setAdModal(null);
            if (pendingDownload) { pendingDownload(); setPendingDownload(null); }
          }}
          onClose={() => setAdModal(null)}
        />
      )}
    </>
  );
}