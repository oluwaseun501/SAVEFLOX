import { useState, useMemo } from "react";
import {
  Download as DownloadIcon, Search, FileDown, Music, Video,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, ArrowUpDown,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/DownloadLogs.css";

/* SAMPLE DATA — replace with API response when backend is ready */
const SAMPLE_LOGS = [
  { id: 1,  timestamp: "2026-04-24 11:42:18", platform: "TikTok",    url: "https://tiktok.com/@user/video/72987...",  format: "MP4", quality: "1080p HD", fileSize: "12.4 MB", status: "success", ip: "102.89.34.12",  country: "Nigeria"      },
  { id: 2,  timestamp: "2026-04-24 11:38:02", platform: "Snapchat", url: "https://snapchat.com/spotlight/abc123...", format: "MP4", quality: "720p", fileSize: "9.3 MB",  status: "success", ip: "85.214.132.117",country: "Germany"      },
  { id: 3,  timestamp: "2026-04-24 11:25:51", platform: "Instagram", url: "https://instagram.com/reel/Cx7p2K...",     format: "MP4", quality: "720p",     fileSize: "8.7 MB",  status: "success", ip: "45.122.65.9",   country: "Indonesia"    },
  { id: 4,  timestamp: "2026-04-24 11:18:33", platform: "Facebook",  url: "https://facebook.com/watch/?v=4427...",    format: "MP4", quality: "1080p HD", fileSize: "22.6 MB", status: "failed",  ip: "201.93.44.18",  country: "Brazil"       },
  { id: 5,  timestamp: "2026-04-24 11:09:14", platform: "TikTok",    url: "https://tiktok.com/@dance/video/729...",   format: "MP3", quality: "256 kbps", fileSize: "3.8 MB",  status: "success", ip: "78.142.5.201",  country: "Spain"        },
  { id: 6,  timestamp: "2026-04-24 10:54:27", platform: "Pinterest", url: "https://pinterest.com/pin/9128345...",     format: "MP4", quality: "720p",     fileSize: "5.2 MB",  status: "success", ip: "162.45.88.6",   country: "United States"},
  { id: 7,  timestamp: "2026-04-24 10:42:08", platform: "Twitter",   url: "https://twitter.com/user/status/178...",   format: "MP4", quality: "480p",     fileSize: "3.1 MB",  status: "success", ip: "190.22.144.7",  country: "Mexico"       },
  { id: 8,  timestamp: "2026-04-24 10:31:55", platform: "Snapchat", url: "https://snapchat.com/spotlight/def456...",      format: "MP4", quality: "1080p HD", fileSize: "18.9 MB", status: "success", ip: "37.205.66.91",  country: "France"       },
  { id: 9,  timestamp: "2026-04-24 10:20:41", platform: "Instagram", url: "https://instagram.com/p/Cy8q4K...",        format: "MP3", quality: "192 kbps", fileSize: "2.3 MB",  status: "failed",  ip: "92.118.43.55",  country: "Italy"        },
  { id: 10, timestamp: "2026-04-24 10:08:19", platform: "TikTok",    url: "https://tiktok.com/@cook/video/729...",    format: "MP4", quality: "1080p HD", fileSize: "14.7 MB", status: "success", ip: "115.85.123.40", country: "Vietnam"      },
  { id: 11, timestamp: "2026-04-24 09:56:02", platform: "Facebook",  url: "https://facebook.com/reel/8821...",        format: "MP4", quality: "720p",     fileSize: "6.5 MB",  status: "success", ip: "203.45.7.122",  country: "India"        },
  { id: 12, timestamp: "2026-04-24 09:41:28", platform: "Snapchat", url: "https://snapchat.com/spotlight/ghi789...",      format: "MP3", quality: "256 kbps", fileSize: "5.6 MB",  status: "success", ip: "41.78.89.5",    country: "South Africa" },
  { id: 13, timestamp: "2026-04-24 09:30:10", platform: "Twitter",   url: "https://twitter.com/news/status/178...",   format: "MP4", quality: "720p",     fileSize: "7.8 MB",  status: "success", ip: "176.44.91.18",  country: "Russia"       },
  { id: 14, timestamp: "2026-04-24 09:18:47", platform: "Instagram", url: "https://instagram.com/reel/Dz9r5L...",     format: "MP4", quality: "1080p HD", fileSize: "11.2 MB", status: "success", ip: "151.66.34.7",   country: "United Kingdom"},
  { id: 15, timestamp: "2026-04-24 09:05:33", platform: "TikTok",    url: "https://tiktok.com/@art/video/728...",     format: "MP3", quality: "320 kbps", fileSize: "4.4 MB",  status: "failed",  ip: "188.22.5.143",  country: "Turkey"       },
  { id: 16, timestamp: "2026-04-24 08:52:11", platform: "Pinterest", url: "https://pinterest.com/pin/8876123...",     format: "MP4", quality: "480p",     fileSize: "2.9 MB",  status: "success", ip: "104.55.78.221", country: "Canada"       },
  { id: 17, timestamp: "2026-04-24 08:40:04", platform: "Facebook",  url: "https://facebook.com/watch/?v=4498...",    format: "MP3", quality: "256 kbps", fileSize: "3.3 MB",  status: "success", ip: "84.122.166.4",  country: "Netherlands"  },
  { id: 18, timestamp: "2026-04-24 08:28:50", platform: "Snapchat", url: "https://snapchat.com/spotlight/jkl012...",      format: "MP4", quality: "1080p HD", fileSize: "28.4 MB", status: "success", ip: "118.45.66.9", country: "Japan"      },
];

const PLATFORMS = ["All", "TikTok", "Instagram", "Facebook", "Twitter", "Pinterest", "Snapchat"];
const FORMATS   = ["All", "MP4", "MP3"];
const STATUSES  = ["All", "success", "failed"];
const PAGE_SIZE = 10;

export default function DownloadLogs() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");
  const [format, setFormat] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = SAMPLE_LOGS.filter((r) => {
      if (platform !== "All" && r.platform !== platform) return false;
      if (format   !== "All" && r.format   !== format)   return false;
      if (status   !== "All" && r.status   !== status)   return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.url.toLowerCase().includes(q) &&
          !r.ip.includes(q) &&
          !r.country.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });

    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

    return rows;
  }, [query, platform, format, status, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const total   = SAMPLE_LOGS.length;
    const success = SAMPLE_LOGS.filter((r) => r.status === "success").length;
    const mp3 = SAMPLE_LOGS.filter((r) => r.format === "MP3").length;
    const mp4 = SAMPLE_LOGS.filter((r) => r.format === "MP4").length;
    const successRate = total ? ((success / total) * 100).toFixed(1) : 0;
    return { total, mp3, mp4, successRate };
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const exportCsv = () => {
    const headers = ["Timestamp","Platform","URL","Format","Quality","Size","Status","IP","Country"];
    const rows = filtered.map((r) => [r.timestamp, r.platform, r.url, r.format, r.quality, r.fileSize, r.status, r.ip, r.country]);
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `download-logs-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dl-shell">
      <AdminSidebar />

      <main className="dl-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="dl-main-inner">
          {/* Header */}
          <div className="dl-header">
            <div>
              <h1 className="dl-title">Downloads Log</h1>
              <p className="dl-subtitle">
                Monitor every download in real time — filter, search and export the activity.
              </p>
            </div>
            <button className="dl-export-btn" onClick={exportCsv}>
              <FileDown size={16} />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="dl-stats">
            <StatCard icon={<DownloadIcon size={18} />} label="Total Downloads" value={stats.total.toLocaleString()} tone="blue" />
            <StatCard icon={<CheckCircle2 size={18} />} label="Success Rate"    value={`${stats.successRate}%`}     tone="green" />
            <StatCard icon={<Video size={18} />}        label="MP4 Downloads"   value={stats.mp4.toLocaleString()}  tone="blue" />
            <StatCard icon={<Music size={18} />}        label="MP3 Downloads"   value={stats.mp3.toLocaleString()}  tone="green" />
          </div>

          {/* Filters */}
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
              {PLATFORMS.map((p) => <option key={p}>{p === "All" ? "All platforms" : p}</option>)}
            </select>

            <select value={format} onChange={(e) => { setFormat(e.target.value); setPage(1); }}>
              {FORMATS.map((f) => <option key={f}>{f === "All" ? "All formats" : f}</option>)}
            </select>

            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="dl-table-wrap">
            <table className="dl-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("timestamp")}>Date / Time <ArrowUpDown size={12} /></th>
                  <th onClick={() => toggleSort("platform")}>Platform <ArrowUpDown size={12} /></th>
                  <th>URL</th>
                  <th>Format</th>
                  <th>Quality</th>
                  <th onClick={() => toggleSort("fileSize")}>Size <ArrowUpDown size={12} /></th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map((row) => (
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
                )) : (
                  <tr>
                    <td colSpan="9" className="dl-empty">No downloads match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dl-pagination">
            <div className="dl-page-info">
              Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> downloads
            </div>
            <div className="dl-page-controls">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <span className="dl-page-current">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">
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