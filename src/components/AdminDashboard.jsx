import {
  Users,
  TrendingUp,
  Activity,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import { analyticsAPI } from "../services/api";
import { supabase } from "../lib/supabase";

const DEFAULT_TRAFFIC_DATA = [
  { day: "Mon", visits: 4200, downloads: 2100 },
  { day: "Tue", visits: 5100, downloads: 2800 },
  { day: "Wed", visits: 4800, downloads: 2500 },
  { day: "Thu", visits: 6200, downloads: 3100 },
  { day: "Fri", visits: 7500, downloads: 3600 },
  { day: "Sat", visits: 9000, downloads: 3800 },
  { day: "Sun", visits: 7200, downloads: 3400 },
];

const DEFAULT_PLATFORM_DATA = [
  { name: "TikTok", value: 4200, fill: "#0f172a" },
  { name: "Twitter", value: 3500, fill: "#ef4444" },
  { name: "Instagram", value: 2800, fill: "#ec4899" },
  { name: "Facebook", value: 3700, fill: "#1d4ed8" },
];

const DEFAULT_RECENT_DOWNLOADS = [
  { id: 1, timestamp: "2 mins ago", platform: "TikTok", format: "MP4 (1080p)", status: "Completed" },

  { id: 3, timestamp: "12 mins ago", platform: "Instagram", format: "MP4 (720p)", status: "Failed" },
  { id: 4, timestamp: "18 mins ago", platform: "Facebook", format: "MP4 (1080p)", status: "Completed" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [platformData, setPlatformData] = useState(DEFAULT_PLATFORM_DATA);
  const [recentDownloads, setRecentDownloads] = useState(DEFAULT_RECENT_DOWNLOADS);
  const [trendData, setTrendData] = useState(DEFAULT_TRAFFIC_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, logsRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getDownloadLogs(6, 0),
        ]);

        const statsData = statsRes?.data || {};
        setStats([
          { label: "Total Downloads", value: statsData.total_downloads?.toLocaleString?.() || "0", change: "+0%", up: true, icon: Download },
          { label: "Downloads Today", value: statsData.downloads_today?.toLocaleString?.() || "0", change: "+0%", up: true, icon: TrendingUp },
          { label: "Success Rate", value: statsData.success_rate != null ? `${statsData.success_rate}%` : "0%", change: "-", up: statsData.success_rate >= 0, icon: Users },
          { label: "MP3 Downloads", value: statsData.mp3_downloads?.toLocaleString?.() || "0", change: "-", up: true, icon: Activity },
        ]);

        const topPlatforms = statsData.top_platforms || [];
        setPlatformData(topPlatforms.length ? topPlatforms.map((p, i) => ({ name: p.platform || "Unknown", value: p.count, fill: ["#0f172a", "#1d4ed8", "#ec4899", "#2563eb"][i % 4] })) : DEFAULT_PLATFORM_DATA);

        const logs = logsRes?.data?.logs || [];
        setRecentDownloads(logs.map((row) => ({
          id: row.id,
          timestamp: row.timestamp,
          platform: row.platform,
          format: row.format,
          status: row.status === 'success' ? 'Completed' : row.status,
        })));

        const now = new Date();
        const end = now.toISOString();
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const trendRes = await analyticsAPI.getAnalyticsByRange(start, end);
        setTrendData(trendRes?.data?.trend.length ? trendRes.data.trend : DEFAULT_TRAFFIC_DATA);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statsList = stats.length ? stats : [
    { label: "Total Visits", value: "124.5K", change: "+12.5%", up: true, icon: Users },
    { label: "Total Downloads", value: "84.2K", change: "+8.2%", up: true, icon: Download },
    { label: "Downloads Today", value: "3,240", change: "+24.1%", up: true, icon: TrendingUp },
    { label: "Active Users", value: "1,432", change: "-2.4%", up: false, icon: Activity },
  ];

  const [adClicks, setAdClicks] = useState([]);
const [adLoading, setAdLoading] = useState(true);

useEffect(() => {
  async function loadAdClicks() {
    setAdLoading(true);
    const { data, error } = await supabase
      .from("ad_clicks")
      .select("slot, link, clicked_at")
      .order("clicked_at", { ascending: false });

    if (!error && data) {
      // Group by slot+link combo
      const grouped = data.reduce((acc, row) => {
        const key = `${row.slot}||${row.link}`;
        if (!acc[key]) {
          acc[key] = { slot: row.slot, link: row.link, clicks: 0, lastClicked: row.clicked_at };
        }
        acc[key].clicks++;
        return acc;
      }, {});
      setAdClicks(Object.values(grouped));
    }
    setAdLoading(false);
  }
  loadAdClicks();
}, []);

  return (
    <div className="admin">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="admin-main-inner">
          <header className="admin-header">
            <div>
              <h1 className="admin-title">Dashboard Overview</h1>
              <p className="admin-subtitle">
                Welcome back, Admin. Here's what's happening today.
              </p>
            </div>
          </header>

          {/* Stat Cards */}
          <div className="admin-stats">
            {loading ? (
              <div className="admin-loading-card">Loading dashboard metrics...</div>
            ) : (
              statsList.map(({ label, value, change, up, icon: Icon }) => (
                <div key={label} className="admin-stat">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon">
                      <Icon size={18} />
                    </div>
                    <span className={`admin-stat-change ${up ? "up" : "down"}`}>
                      {change}
                    </span>
                  </div>
                  <div className="admin-stat-label">{label}</div>
                  <div className="admin-stat-value">{value}</div>
                </div>
              ))
            )}
          </div>
          {error && <div className="admin-error-banner">{error}</div>}

          {/* Charts */}
          <div className="admin-charts">
            <div className="admin-chart-card">
              <h2 className="admin-chart-title">
                Traffic &amp; Downloads (Last 7 Days)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="downloads" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Downloads by Platform</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Downloads */}
          <div className="admin-table-card">
            <h2 className="admin-chart-title">Recent Downloads</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Platform</th>
                    <th>Format</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDownloads.map((row) => (
                    <tr key={row.id}>
                      <td>{row.timestamp}</td>
                      <td>{row.platform}</td>
                      <td>{row.format}</td>
                      <td>
                        <span className={`admin-status ${row.status === "Completed" ? "ok" : "fail"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ad Performance */}
<div className="admin-section">
  <h2 className="admin-chart-title" style={{ marginBottom: "1rem" }}>
    Ad Performance by Page
  </h2>

  {adLoading ? (
    <div className="admin-loading-card">Loading ad data...</div>
  ) : adClicks.length === 0 ? (
    <p style={{ color: "#94a3b8" }}>No ad clicks recorded yet.</p>
  ) : (
    <div className="ad-perf-grid">
      {[
        { label: "Home Page", prefixes: ["home"] },
        { label: "TikTok Page", prefixes: ["tiktok"] },
        { label: "Twitter Page", prefixes: ["twitter"] },
        { label: "Facebook Page", prefixes: ["facebook"] },
        { label: "Instagram Page", prefixes: ["instagram"] },
        { label: "Pinterest Page", prefixes: ["pinterest"] },
        { label: "MP3 Converter", prefixes: ["mp3"] },
        // { label: "Download Popup", prefixes: ["popup", "download-popup"] },
      ].map(({ label, prefixes }) => {
        const rows = adClicks.filter((r) =>
          prefixes.some((p) => r.slot.startsWith(p))
        );
        if (rows.length === 0) return null;
        const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);

        return (
          <div className="ad-perf-card" key={label}>
            <div className="ad-perf-card-header">
              <span className="ad-perf-page">{label}</span>
              <span className="ad-perf-total">{totalClicks} clicks</span>
            </div>
            <table className="admin-table">
              <thead>
  <tr>
    <th>Slot</th>
    <th>Clicks</th>
    <th>Backlink</th>
    <th>Last Click</th>
  </tr>
</thead>
<tbody>
  {rows.map((row) => (
    <tr key={`${row.slot}||${row.link}`}>
      <td>
        <span className="ad-slot-badge">{row.slot}</span>
      </td>
      <td><strong>{row.clicks}</strong></td>
      <td style={{ fontSize: "0.78rem" }}>
        {row.link && row.link !== "none" ? (
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1d4ed8", textDecoration: "underline", wordBreak: "break-all" }}
          >
            {row.link}
          </a>
        ) : (
          <span style={{ color: "#94a3b8" }}>—</span>
        )}
      </td>
      <td style={{ fontSize: "0.78rem", color: "#64748b" }}>
        {new Date(row.lastClicked).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        );
      })}
    </div>
  )}
</div>
        </div>
      </main>
    </div>
  );
}