import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Percent,
  Clock,
  Music,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { analyticsAPI } from "../services/api";

const ranges = ["Last 7 days", "Last 30 days", "Last 90 days", "Custom"];

const trendData = [
  { date: "Wk 1", visits: 18000, downloads: 11000 },
  { date: "Wk 2", visits: 22000, downloads: 14500 },
  { date: "Wk 3", visits: 19500, downloads: 12800 },
  { date: "Wk 4", visits: 28000, downloads: 19200 },
];

const platformData = [
  { name: "TikTok", value: 38, fill: "#0f172a" },
  { name: "Twitter", value: 18, fill: "#1d4ed8" },
  { name: "Instagram", value: 22, fill: "#ec4899" },
  { name: "Facebook", value: 14, fill: "#2563eb" },
  { name: "MP3", value: 8, fill: "#22c55e" },
];

const formatData = [
  { name: "MP4 1080p", count: 12400 },
  { name: "MP4 720p", count: 9200 },
  { name: "MP4 480p", count: 4100 },
  { name: "MP3 320kbps", count: 7800 },
  { name: "MP3 128kbps", count: 2300 },
];

const countryData = [
  { name: "United States", count: 28400 },
  { name: "India", count: 21200 },
  { name: "Brazil", count: 15600 },
  { name: "United Kingdom", count: 9800 },
  { name: "Nigeria", count: 8200 },
  { name: "Germany", count: 6400 },
];

const deviceData = [
  { name: "Mobile", value: 64, fill: "#1d4ed8" },
  { name: "Desktop", value: 28, fill: "#22c55e" },
  { name: "Tablet", value: 8, fill: "#f59e0b" },
];

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Generates a deterministic intensity 0–1 per cell
const heatmap = days.map((d, di) =>
  hours.map((h) => {
    const peak = h >= 18 && h <= 22 ? 0.9 : h >= 12 && h <= 17 ? 0.6 : 0.25;
    const weekendBoost = di >= 5 ? 0.15 : 0;
    return Math.min(1, peak + weekendBoost + ((h * (di + 1)) % 7) / 50);
  })
);

const DEFAULT_EMPTY = [];

export default function Analytics() {
  const [range, setRange] = useState("Last 30 days");
  const [stats, setStats] = useState({});
  const [trendDataState, setTrendDataState] = useState(DEFAULT_EMPTY);
  const [platformDataState, setPlatformDataState] = useState(DEFAULT_EMPTY);
  const [countryDataState, setCountryDataState] = useState(DEFAULT_EMPTY);
  const [deviceDataState, setDeviceDataState] = useState(DEFAULT_EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, platformsRes, countriesRes, devicesRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getPlatformAnalytics(),
          analyticsAPI.getCountryAnalytics(),
          analyticsAPI.getDeviceAnalytics(),
        ]);

        setStats(statsRes?.data || {});

        const platforms = platformsRes?.data?.platforms || [];
        setPlatformDataState(platforms.map((p, i) => ({ name: p.platform, value: p.count, fill: ["#0f172a","#1d4ed8","#ec4899","#2563eb","#22c55e"][i % 5] })));

        const countries = countriesRes?.data?.countries || [];
        setCountryDataState(countries.map((c) => ({ name: c.country, count: c.count })));

        const devices = devicesRes?.data?.devices || [];
        setDeviceDataState(devices.map((d, i) => ({ name: d.device || 'Unknown', value: d.count, fill: ["#1d4ed8","#22c55e","#f59e0b"][i % 3] })));

        // Trend: load default 30d range
        const now = new Date();
        const end = now.toISOString();
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const trendRes = await analyticsAPI.getAnalyticsByRange(start, end);
        setTrendDataState(trendRes?.data?.trend || DEFAULT_EMPTY);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const kpis = [
    { label: "Total Downloads", value: stats.total_downloads?.toLocaleString?.() || "—", change: "+0%", up: true, icon: Download },
    { label: "Downloads Today", value: stats.downloads_today || "—", change: "+0%", up: true, icon: Clock },
    { label: "Success Rate", value: stats.success_rate ? `${stats.success_rate}%` : "—", change: "-", up: stats.success_rate >= 0, icon: Percent },
    { label: "MP3 Downloads", value: stats.mp3_downloads?.toLocaleString?.() || "—", change: "-", up: true, icon: Music },
  ];

  return (
    <div className="admin">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="admin-main-inner">
          {/* Header + range picker */}
          <header className="analytics-header">
            <div>
              <h1 className="admin-title">Analytics</h1>
              <p className="admin-subtitle">
                Deep dive into traffic, downloads, and audience trends.
              </p>
            </div>
            <div className="analytics-range">
              {ranges.map((r) => (
                <button
                  key={r}
                  className={`analytics-range-btn ${range === r ? "active" : ""}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </header>

          {/* KPIs */}
          <div className="admin-stats">
            {kpis.map(({ label, value, change, up, icon: Icon }) => (
              <div key={label} className="admin-stat">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <Icon size={18} />
                  </div>
                  <span className={`admin-stat-change ${up ? "up" : "down"}`}>
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {change}
                  </span>
                </div>
                <div className="admin-stat-label">{label}</div>
                <div className="admin-stat-value">{value}</div>
                <div className="analytics-kpi-sub">vs previous period</div>
              </div>
            ))}
          </div>

          {/* Trend */}
          <div className="admin-chart-card">
            <div className="analytics-card-head">
              <h2 className="admin-chart-title">Traffic &amp; Downloads Trend</h2>
              <span className="analytics-pill">{range}</span>
            </div>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendDataState.length ? trendDataState : trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="downloads" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Two-up: platform + device */}
          <div className="analytics-grid-2">
            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Downloads by Platform</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                      data={platformDataState.length ? platformDataState : platformData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                      {(platformDataState.length ? platformDataState : platformData).map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Devices</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={deviceDataState.length ? deviceDataState : deviceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {(deviceDataState.length ? deviceDataState : deviceData).map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two-up: format + countries */}
          <div className="analytics-grid-2">
            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Downloads by Format</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={formatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Top Countries</h2>
              <ul className="analytics-country-list">
                {countryDataState.length ? countryDataState.map((c, index) => {
                  const max = countryDataState[0]?.count || 1;
                  const pct = (c.count / max) * 100;
                  return (
                    <li key={c.name} className="analytics-country">
                      <div className="analytics-country-row">
                        <span className="analytics-country-name">{c.name}</span>
                        <span className="analytics-country-count">
                          {c.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="analytics-country-bar">
                        <div
                          className="analytics-country-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                }) : (
                  <li className="analytics-country">
                    <span className="analytics-country-name">No country data available</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Peak hours heatmap */}
          <div className="admin-chart-card">
            <div className="analytics-card-head">
              <h2 className="admin-chart-title">Peak Download Hours</h2>
              <div className="analytics-legend">
                <span>Less</span>
                <div className="analytics-legend-scale">
                  <span style={{ background: "rgba(29, 78, 216, 0.1)" }} />
                  <span style={{ background: "rgba(29, 78, 216, 0.3)" }} />
                  <span style={{ background: "rgba(29, 78, 216, 0.55)" }} />
                  <span style={{ background: "rgba(29, 78, 216, 0.8)" }} />
                  <span style={{ background: "rgba(29, 78, 216, 1)" }} />
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="analytics-heatmap">
              <div className="analytics-heatmap-hours">
                <span />
                {hours.map((h) => (
                  <span key={h} className="analytics-heatmap-hour">
                    {h % 3 === 0 ? `${h}:00` : ""}
                  </span>
                ))}
              </div>
              {heatmap.map((row, di) => (
                <div key={days[di]} className="analytics-heatmap-row">
                  <span className="analytics-heatmap-day">{days[di]}</span>
                  {row.map((v, hi) => (
                    <span
                      key={hi}
                      className="analytics-heatmap-cell"
                      style={{ background: `rgba(29, 78, 216, ${0.08 + v * 0.85})` }}
                      title={`${days[di]} ${hi}:00 — intensity ${(v * 100).toFixed(0)}%`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}