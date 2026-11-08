import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download as DownloadIcon,
  FileDown,
  Music,
  Search,
  Video,
  XCircle,
  Globe,
  Monitor,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/DownloadLogs.css";
import { analyticsAPI, authAPI } from "../services/api";

const PLATFORMS = [
  "All",
  "TikTok",
  "Snapchat",
  "Instagram",
  "Facebook",
  "Twitter",
  "Pinterest",
];
const FORMATS = ["All", "MP4", "MP3"];
const STATUSES = ["All", "success", "failed"];
const PAGE_SIZE = 10;

function getLogKey(log, index) {
  return String(log.id || `${log.timestamp || "download"}-${index}`);
}

function getPlatformClass(platform) {
  return String(platform || "unknown").toLowerCase();
}

function getFormatClass(format) {
  return String(format || "unknown").toLowerCase();
}

export default function DownloadLogs() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");
  const [format, setFormat] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    mp3: 0,
    mp4: 0,
    successRate: 0,
  });
  const [email, setEmail] = useState("admin@saveflux.com");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      setLoading(true);
      setError("");

      try {
        const response = await analyticsAPI.getDownloadLogs(
          PAGE_SIZE,
          (page - 1) * PAGE_SIZE,
          { query, platform, status, format }
        );

        if (!mounted) return;

        setLogs(response.data.logs || []);
        setTotal(response.data.total || 0);

        const [mp3Res, mp4Res, statsRes] = await Promise.all([
          analyticsAPI.getDownloadLogs(1, 0, { format: "MP3" }).catch(() => null),
          analyticsAPI.getDownloadLogs(1, 0, { format: "MP4" }).catch(() => null),
          analyticsAPI.getDashboardStats().catch(() => null),
        ]);

        if (!mounted) return;

        setStats({
          total: response.data.total || 0,
          mp3: mp3Res?.data?.total || 0,
          mp4: mp4Res?.data?.total || 0,
          successRate: statsRes?.data?.success_rate ?? 0,
        });
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.error || "Unable to load download logs.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadLogs();
    return () => { mounted = false; };
  }, [query, platform, format, status, page]);

  useEffect(() => {
    let mounted = true;
    authAPI.getProfile().then((res) => {
      if (!mounted) return;
      setEmail(res.data?.user?.email || "admin@saveflux.com");
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const exportCsv = () => {
    const headers = ["Timestamp", "Platform", "URL", "Format", "Quality", "Size", "Status", "IP", "Country", "City", "ISP"];
    const rows = logs.map((log) => [
      log.timestamp, log.platform, log.url, log.format, log.quality, log.fileSize, log.status, log.ip, log.country, log.city || "", log.isp || "",
    ]);
    const csv = [headers, ...rows].map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `download-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dl-shell">
      <AdminSidebar />
      <main className="dl-main">
        <AdminTopbar email={email} />

        <div className="dl-main-inner">
          <div className="dl-header">
            <div>
              <h1 className="dl-title">Downloads Log</h1>
              <p className="dl-subtitle">
                Monitor every download in real time — filter, search and export.
              </p>
            </div>
            <button
              className="dl-export-btn"
              type="button"
              onClick={exportCsv}
              disabled={loading || logs.length === 0}
            >
              <FileDown size={16} /> Export CSV
            </button>
          </div>

          {error && <div className="admin-error-banner">{error}</div>}

          <div className="dl-stats">
            <StatCard icon={<DownloadIcon size={18} />} label="Total Downloads" value={stats.total.toLocaleString()} tone="blue" />
            <StatCard icon={<CheckCircle2 size={18} />} label="Success Rate" value={`${stats.successRate}%`} tone="green" />
            <StatCard icon={<Video size={18} />} label="MP4 Downloads" value={stats.mp4.toLocaleString()} tone="blue" />
            <StatCard icon={<Music size={18} />} label="MP3 Downloads" value={stats.mp3.toLocaleString()} tone="green" />
          </div>

          <div className="dl-filters">
            <div className="dl-search">
              <Search size={16} className="dl-search-icon" />
              <input
                type="text"
                placeholder="Search by URL, IP or country..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select value={platform} onChange={updateFilter(setPlatform)}>
              {PLATFORMS.map((item) => (
                <option key={item} value={item}>{item === "All" ? "All platforms" : item}</option>
              ))}
            </select>
            <select value={format} onChange={updateFilter(setFormat)}>
              {FORMATS.map((item) => (
                <option key={item} value={item}>{item === "All" ? "All formats" : item}</option>
              ))}
            </select>
            <select value={status} onChange={updateFilter(setStatus)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>{item === "All" ? "All statuses" : item.charAt(0).toUpperCase() + item.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* NEW GRID LAYOUT */}
          {loading ? (
            <div className="dl-empty">Loading downloads…</div>
          ) : logs.length > 0 ? (
            <div className="dl-grid">
              {logs.map((log, index) => (
                <div className="dl-log-card" key={getLogKey(log, index)}>
                  {/* Card Header: Platform, Status, Date */}
                  <div className="dl-log-header">
                    <div className="dl-log-header-left">
                      <span className={`dl-platform-tag ${getPlatformClass(log.platform)}`}>
                        {log.platform || "Unknown"}
                      </span>
                      <span className={`dl-format-tag ${getFormatClass(log.format)}`}>
                        {log.format === "MP3" ? <Music size={12} /> : <Video size={12} />}
                        {log.format}
                      </span>
                    </div>
                    <div className="dl-log-header-right">
                      {log.status === "success" ? (
                        <span className="dl-status success"><CheckCircle2 size={14} /> Success</span>
                      ) : (
                        <span className="dl-status failed"><XCircle size={14} /> Failed</span>
                      )}
                      <span className="dl-log-date">{log.timestamp}</span>
                    </div>
                  </div>

                  {/* Card Body: URL & Quality */}
                  <div className="dl-log-body">
                    <span className="dl-url" title={log.url}>{log.url || "No URL"}</span>
                    <span className="dl-quality">{log.quality} · {log.fileSize}</span>
                  </div>

                  {/* Card Footer: Location & IP */}
                  <div className="dl-log-footer">
                    <div className="dl-log-meta">
                      <Globe size={13} className="dl-icon-muted" />
                      <span>{log.country || "Unknown"} {log.city ? `, ${log.city}` : ""}</span>
                    </div>
                    <div className="dl-log-meta">
                      <Monitor size={13} className="dl-icon-muted" />
                      <span>{log.ip} {log.isp ? `(${log.isp})` : ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dl-empty">No downloads match your filters.</div>
          )}

          <div className="dl-pagination">
            <div className="dl-page-info">
              Showing <strong>{logs.length}</strong> of <strong>{total}</strong> downloads
            </div>
            <div className="dl-page-controls">
              <button type="button" onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={page === 1 || loading}>
                <ChevronLeft size={16} />
              </button>
              <span className="dl-page-number">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={page === totalPages || loading}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, tone = "blue" }) {
  return (
    <div className="dl-stat-card">
      <div className={`dl-stat-icon ${tone}`}>{icon}</div>
      <div className="dl-stat-label">{label}</div>
      <div className="dl-stat-value">{value}</div>
    </div>
  );
}