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

const trendDataFallback = [
  { date: "Wk 1", visits: 18000, downloads: 11000 },
  { date: "Wk 2", visits: 22000, downloads: 14500 },
  { date: "Wk 3", visits: 19500, downloads: 12800 },
  { date: "Wk 4", visits: 28000, downloads: 19200 },
];

// Snapchat removed
const platformDataFallback = [
  { name: "TikTok", value: 38, fill: "#0f172a" },
  { name: "Twitter", value: 18, fill: "#1d4ed8" },
  { name: "Instagram", value: 22, fill: "#ec4899" },
  { name: "Facebook", value: 14, fill: "#2563eb" },
  { name: "MP3", value: 8, fill: "#22c55e" },
];

const deviceDataFallback = [
  { name: "Mobile", value: 64, fill: "#1d4ed8" },
  { name: "Desktop", value: 28, fill: "#22c55e" },
  { name: "Tablet", value: 8, fill: "#f59e0b" },
];

const formatData = [
  { name: "MP4 1080p", count: 12400 },
  { name: "MP4 720p", count: 9200 },
  { name: "MP4 480p", count: 4100 },
  { name: "MP3 320kbps", count: 7800 },
  { name: "MP3 128kbps", count: 2300 },
];

const DEFAULT_EMPTY = [];

function getRangeDays(range) {
  if (range === "Last 7 days") return 7;
  if (range === "Last 90 days") return 90;
  return 30;
}

function getDateRange(range) {
  const now = new Date();
  const end = now.toISOString();
  const start = new Date(
    now.getTime() - getRangeDays(range) * 24 * 60 * 60 * 1000
  ).toISOString();
  return { start, end };
}

async function safeCall(fn) {
  try {
    const res = await fn();
    return res;
  } catch {
    return null;
  }
}

export default function Analytics() {
  const [range, setRange] = useState("Last 30 days");
  const [stats, setStats] = useState({});
  const [trendDataState, setTrendDataState] = useState(DEFAULT_EMPTY);
  const [platformDataState, setPlatformDataState] = useState(DEFAULT_EMPTY);
  const [deviceDataState, setDeviceDataState] = useState(DEFAULT_EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rangeTotal, setRangeTotal] = useState(null);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    if (range === "Custom" && (!customStart || !customEnd)) return;
    async function load() {
      setLoading(true);
      setError(null);
      const { start, end } =
        range === "Custom"
          ? {
              start: new Date(customStart).toISOString(),
              end: new Date(customEnd + "T23:59:59").toISOString(),
            }
          : getDateRange(range);
      try {
        const [statsRes, platformsRes, devicesRes, trendRes] =
          await Promise.all([
            safeCall(() => analyticsAPI.getDashboardStats(start, end)),
            safeCall(() => analyticsAPI.getPlatformAnalytics(start, end)),
            safeCall(() => analyticsAPI.getDeviceAnalytics(start, end)),
            safeCall(() => analyticsAPI.getAnalyticsByRange(start, end)),
          ]);

        setStats(statsRes?.data || {});

        const platforms = platformsRes?.data?.platforms || [];
        // Filter out Snapchat from live data
        const filteredPlatforms = platforms.filter(
          (p) => p.platform?.toLowerCase() !== "snapchat"
        );
        setPlatformDataState(
          filteredPlatforms.map((p, i) => ({
            name: p.platform,
            value: p.count,
            fill: ["#0f172a", "#1d4ed8", "#ec4899", "#2563eb", "#22c55e"][i % 5],
          }))
        );

        const devices = devicesRes?.data?.devices || [];
        setDeviceDataState(
          devices.map((d, i) => ({
            name: d.device || "Unknown",
            value: d.count,
            fill: ["#1d4ed8", "#22c55e", "#f59e0b"][i % 3],
          }))
        );

        const trend = trendRes?.data?.trend || DEFAULT_EMPTY;
        setTrendDataState(trend);
        const total = trend.reduce((sum, day) => sum + (day.downloads || 0), 0);
        setRangeTotal(total);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range, customStart, customEnd]);

  const kpis = [
    {
      label: "Total Downloads",
      value:
        rangeTotal !== null
          ? rangeTotal.toLocaleString()
          : stats.total_downloads?.toLocaleString?.() || "—",
      change: "+0%",
      up: true,
      icon: Download,
    },
    {
      label: "Downloads Today",
      value: stats.downloads_today || "—",
      change: "+0%",
      up: true,
      icon: Clock,
    },
    {
      label: "Success Rate",
      value: stats.success_rate ? `${stats.success_rate}%` : "—",
      change: "-",
      up: stats.success_rate >= 0,
      icon: Percent,
    },
    {
      label: "MP3 Downloads",
      value: stats.mp3_downloads?.toLocaleString?.() || "—",
      change: "-",
      up: true,
      icon: Music,
    },
  ];

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />
        <div className="admin-main-inner">
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

            {range === "Custom" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
                <span>to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}
          </header>

          {loading && (
            <div className="admin-loading-card">Loading analytics...</div>
          )}
          {error && <div className="admin-error-banner">{error}</div>}

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

          <div className="admin-chart-card">
            <div className="analytics-card-head">
              <h2 className="admin-chart-title">
                Traffic &amp; Downloads Trend
              </h2>
              <span className="analytics-pill">{range}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={trendDataState.length ? trendDataState : trendDataFallback}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-grid-2">
            {/* Downloads by Platform — Snapchat removed */}
            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Downloads by Platform</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={
                      platformDataState.length
                        ? platformDataState
                        : platformDataFallback
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {(platformDataState.length
                      ? platformDataState
                      : platformDataFallback
                    ).map((entry, i) => (
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
                    data={
                      deviceDataState.length
                        ? deviceDataState
                        : deviceDataFallback
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {(deviceDataState.length
                      ? deviceDataState
                      : deviceDataFallback
                    ).map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Downloads by Format */}
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

          {/* Peak Download Hours removed */}
        </div>
      </main>
    </div>
  );
}
