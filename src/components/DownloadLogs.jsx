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
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/DownloadLogs.css";
import { analyticsAPI, authAPI } from "../services/api";

const PLATFORMS = [
  "All",
  "TikTok",
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

function MobileDownloadCard({ log, expanded, onToggle }) {
  const format = log.format || "Unknown";
  const isSuccess = log.status === "success";

  return (
    <article className={`dl-mobile-card ${expanded ? "is-expanded" : ""}`}>
      <button
        className="dl-mobile-card-toggle"
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div className="dl-mobile-card-top">
          <span className={`dl-platform-tag ${getPlatformClass(log.platform)}`}>
            {log.platform || "Unknown platform"}
          </span>
          <span className={`dl-status ${isSuccess ? "success" : "failed"}`}>
            {isSuccess ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {isSuccess ? "Success" : "Failed"}
          </span>
        </div>

        <div className="dl-mobile-url" title={log.url}>
          {log.url || "URL unavailable"}
        </div>

        <div className="dl-mobile-card-summary">
          <time>{log.timestamp || "Unknown time"}</time>
          <span className={`dl-format-tag ${getFormatClass(format)}`}>
            {format === "MP3" ? <Music size={11} /> : <Video size={11} />}
            {format}
          </span>
          <span>{log.quality || "—"}</span>
          <span>{log.fileSize || "—"}</span>
          <ChevronDown
            className="dl-mobile-chevron"
            size={16}
            aria-hidden="true"
          />
        </div>
      </button>

      {expanded && (
        <div className="dl-mobile-details">
          <div>
            <span>IP address</span>
            <strong>{log.ip || "—"}</strong>
          </div>
          <div>
            <span>Country</span>
            <strong>{log.country || "—"}</strong>
          </div>
          <div>
            <span>City</span>
            <strong>{log.city || "—"}</strong>
          </div>
          <div>
            <span>ISP</span>
            <strong>{log.isp || "—"}</strong>
          </div>
          <div>
            <span>Quality</span>
            <strong>{log.quality || "—"}</strong>
          </div>
          <div>
            <span>File size</span>
            <strong>{log.fileSize || "—"}</strong>
          </div>
        </div>
      )}
    </article>
  );
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
  const [expandedMobileId, setExpandedMobileId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      setLoading(true);
      setError("");
      setExpandedMobileId(null);

      try {
        const response = await analyticsAPI.getDownloadLogs(
          PAGE_SIZE,
          (page - 1) * PAGE_SIZE,
          {
            query,
            platform,
            status,
            format,
          },
        );

        if (!mounted) return;

        const fetchedLogs = response.data.logs || [];
        setLogs(fetchedLogs);
        setTotal(response.data.total || 0);

        const [mp3Res, mp4Res, statsRes] = await Promise.all([
          analyticsAPI
            .getDownloadLogs(1, 0, { format: "MP3" })
            .catch(() => null),
          analyticsAPI
            .getDownloadLogs(1, 0, { format: "MP4" })
            .catch(() => null),
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
    return () => {
      mounted = false;
    };
  }, [query, platform, format, status, page]);

  useEffect(() => {
    let mounted = true;

    authAPI
      .getProfile()
      .then((response) => {
        if (!mounted) return;
        setEmail(response.data?.user?.email || "admin@saveflux.com");
      })
      .catch(() => {
        // Keep the default admin email when the profile request is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "Timestamp",
      "Platform",
      "URL",
      "Format",
      "Quality",
      "Size",
      "Status",
      "IP",
      "Country",
      "City",
      "ISP",
    ];
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
      log.city || "",
      log.isp || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `download-logs-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
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
                Monitor every download in real time — filter, search and export
                the activity.
              </p>
            </div>
            <button
              className="dl-export-btn"
              type="button"
              onClick={exportCsv}
              disabled={loading || logs.length === 0}
            >
              <FileDown size={16} />
              Export CSV
            </button>
          </div>

          {error && <div className="admin-error-banner">{error}</div>}

          <div className="dl-stats">
            <StatCard
              icon={<DownloadIcon size={18} />}
              label="Total Downloads"
              value={stats.total.toLocaleString()}
              tone="blue"
            />
            <StatCard
              icon={<CheckCircle2 size={18} />}
              label="Success Rate"
              value={`${stats.successRate}%`}
              tone="green"
            />
            <StatCard
              icon={<Video size={18} />}
              label="MP4 Downloads"
              value={stats.mp4.toLocaleString()}
              tone="blue"
            />
            <StatCard
              icon={<Music size={18} />}
              label="MP3 Downloads"
              value={stats.mp3.toLocaleString()}
              tone="green"
            />
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
                <option key={item} value={item}>
                  {item === "All" ? "All platforms" : item}
                </option>
              ))}
            </select>

            <select value={format} onChange={updateFilter(setFormat)}>
              {FORMATS.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All formats" : item}
                </option>
              ))}
            </select>

            <select value={status} onChange={updateFilter(setStatus)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All statuses"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
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
                  <th>City</th>
                  <th>ISP</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="dl-empty">
                      Loading downloads…
                    </td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((row, index) => (
                    <tr key={getLogKey(row, index)}>
                      <td className="dl-cell-time">{row.timestamp}</td>
                      <td>
                        <span
                          className={`dl-platform-tag ${getPlatformClass(
                            row.platform,
                          )}`}
                        >
                          {row.platform}
                        </span>
                      </td>
                      <td className="dl-cell-url" title={row.url}>
                        {row.url}
                      </td>
                      <td>
                        <span
                          className={`dl-format-tag ${getFormatClass(
                            row.format,
                          )}`}
                        >
                          {row.format === "MP3" ? (
                            <Music size={11} />
                          ) : (
                            <Video size={11} />
                          )}
                          {row.format}
                        </span>
                      </td>
                      <td>{row.quality}</td>
                      <td>{row.fileSize}</td>
                      <td>
                        {row.status === "success" ? (
                          <span className="dl-status success">
                            <CheckCircle2 size={13} /> Success
                          </span>
                        ) : (
                          <span className="dl-status failed">
                            <XCircle size={13} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="dl-cell-mono">{row.ip}</td>
                      <td>{row.country}</td>
                      <td>{row.city || "—"}</td>
                      <td>{row.isp || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="dl-empty">
                      No downloads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dl-mobile-list">
            {loading ? (
              <div className="dl-mobile-state">Loading downloads…</div>
            ) : logs.length > 0 ? (
              logs.map((row, index) => {
                const key = getLogKey(row, index);
                return (
                  <MobileDownloadCard
                    expanded={expandedMobileId === key}
                    key={key}
                    log={row}
                    onToggle={() =>
                      setExpandedMobileId((current) =>
                        current === key ? null : key,
                      )
                    }
                  />
                );
              })
            ) : (
              <div className="dl-mobile-state">
                No downloads match your filters.
              </div>
            )}
          </div>

          <div className="dl-pagination">
            <div className="dl-page-info">
              Showing <strong>{logs.length}</strong> of <strong>{total}</strong>{" "}
              downloads
            </div>
            <div className="dl-page-controls">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || loading}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="dl-page-number">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages || loading}
                aria-label="Next page"
              >
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
