import { useState, useEffect } from "react";
import {
  Download as DownloadIcon,
  Search,
  FileDown,
  Music,
  Video,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/DownloadLogs.css";
import { analyticsAPI, authAPI } from "../services/api";

const PLATFORMS = ["All", "TikTok", "Instagram", "Facebook", "Twitter", "Pinterest", "Snapchat"];
const FORMATS = ["All", "MP4", "MP3"];
const STATUSES = ["All", "success", "failed"];
const PAGE_SIZE = 10;

export default function DownloadLogs() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");
  const [format, setFormat] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, mp3: 0, mp4: 0, successRate: 0 });
  const [email, setEmail] = useState("admin@saveflux.com");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      setLoading(true);
      setError("");

      try {
        const response = await analyticsAPI.getDownloadLogs(PAGE_SIZE, (page - 1) * PAGE_SIZE, {
          query,
          platform,
          status,
          format,
        });

        if (!mounted) return;

        const fetchedLogs = response.data.logs || [];
        setLogs(fetchedLogs);
        setTotal(response.data.total || 0);

        // After:
const successCount = fetchedLogs.filter((row) => row.status === "success").length;

const [mp3Res, mp4Res] = await Promise.all([
  analyticsAPI.getDownloadLogs(1, 0, { format: "MP3" }).catch(() => null),
  analyticsAPI.getDownloadLogs(1, 0, { format: "MP4" }).catch(() => null),
]);

setStats({
  total: response.data.total || 0,
  mp3: mp3Res?.data?.total || 0,
  mp4: mp4Res?.data?.total || 0,
  successRate: fetchedLogs.length ? Math.round((successCount / fetchedLogs.length) * 100) : 0,
});

      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.error || "Unable to load download logs.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    loadLogs();
    return () => {
      mounted = false;
    };
  }, [query, platform, format, status, page]);

  useEffect(() => {
    let mounted = true;
    authAPI.getProfile().then((response) => {
      if (!mounted) return;
      setEmail(response.data?.user?.email || "admin@saveflux.com");
    }).catch(() => {
      if (!mounted) return;
    });
    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const exportCsv = () => {
    const headers = ["Timestamp", "Platform", "URL", "Format", "Quality", "Size", "Status", "IP", "Country"];
    const rows = logs.map((log) => [
      log.timestamp,
      log.platform,
      log.url,
      log.format,
      log.quality,
      log.fileSize,
      log.status,
      log.ip,
      log.country,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `download-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
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
                Monitor every download in real time — filter, search and export the activity.
              </p>
            </div>
            <button className="dl-export-btn" onClick={exportCsv} disabled={loading || logs.length === 0}>
              <FileDown size={16} />
              Export CSV
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
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>

            <select value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1); }}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All platforms" : p}
                </option>
              ))}
            </select>

            <select value={format} onChange={(e) => { setFormat(e.target.value); setPage(1); }}>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f === "All" ? "All formats" : f}
                </option>
              ))}
            </select>

            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="dl-table-wrap">
            <table className="dl-table">
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>Platform</th>
                  <th>URL</th>
                  <th>Format</th>
                  <th>Quality</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="dl-empty">Loading downloads…</td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((row) => (
                    <tr key={row.id}>
                      <td className="dl-cell-time">{row.timestamp}</td>
                      <td><span className={`dl-platform-tag ${row.platform.toLowerCase()}`}>{row.platform}</span></td>
                      <td className="dl-cell-url" title={row.url}>{row.url}</td>
                      <td>
                        <span className={`dl-format-tag ${row.format.toLowerCase()}`}>
                          {row.format === "MP3" ? <Music size={11} /> : <Video size={11} />}
                          {row.format}
                        </span>
                      </td>
                      <td>{row.quality}</td>
                      <td>{row.fileSize}</td>
                      <td>
                        {row.status === "success" ? (
                          <span className="dl-status success"><CheckCircle2 size={13} /> Success</span>
                        ) : (
                          <span className="dl-status failed"><XCircle size={13} /> Failed</span>
                        )}
                      </td>
                      <td className="dl-cell-mono">{row.ip}</td>
                      <td>{row.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="dl-empty">No downloads match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dl-pagination">
            <div className="dl-page-info">
              Showing <strong>{logs.length}</strong> of <strong>{total}</strong> downloads
            </div>
            <div className="dl-page-controls">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading} aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <span className="dl-page-number">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading} aria-label="Next page">
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