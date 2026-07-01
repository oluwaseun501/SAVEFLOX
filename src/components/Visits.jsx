import { useState, useEffect } from "react";
import { Globe, Users, MapPin, Clock, Download, TrendingUp } from "lucide-react";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer, Cell,
} from "recharts";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { analyticsAPI } from "../services/api";
import { supabase } from "../lib/supabase";

const PLATFORM_COLORS = {
  tiktok:    "#0f172a",
  instagram: "#ec4899",
  twitter:   "#1d4ed8",
  facebook:  "#2563eb",
  pinterest: "#ef4444",
  youtube:   "#dc2626",
};
const FORMAT_COLORS = ["#1d4ed8", "#22c55e", "#f59e0b", "#ec4899"];

function getPlatformColor(name = "") {
  return PLATFORM_COLORS[name.toLowerCase()] || "#94a3b8";
}

export default function Visits() {
  const [visitCountries,    setVisitCountries]    = useState([]);
  const [downloadCountries, setDownloadCountries] = useState([]);
  const [platformData,      setPlatformData]      = useState([]);
  const [formatData,        setFormatData]        = useState([]);
  const [visitTrend,        setVisitTrend]        = useState([]);
  const [recentDownloads,   setRecentDownloads]   = useState([]);
  const [totalVisits,       setTotalVisits]       = useState(0);
  const [todayVisits,       setTodayVisits]       = useState(0);
  const [totalDownloads,    setTotalDownloads]    = useState(0);
  const [loading,           setLoading]           = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        // Run Supabase visitor query + API calls in parallel
        const [visitorRes, logsRes, statsRes] = await Promise.all([
          // ── Visitor countries: exact same query that worked before ──
          supabase.from("visitor_logs").select("country, created_at, timestamp"),
          // ── Download logs via API (already works in Downloads Log page) ──
          analyticsAPI.getDownloadLogs(500, 0, {}).catch(() => null),
          analyticsAPI.getDashboardStats().catch(() => null),
        ]);

        // ── Visits by country (from visitor_logs — the working Supabase query) ──
        const vData = visitorRes?.data || [];
        if (vData.length > 0) {
          setTotalVisits(vData.length);

          const todayStr = new Date().toISOString().slice(0, 10);
          setTodayVisits(
            vData.filter((r) => (r.created_at || r.timestamp || "").slice(0, 10) === todayStr).length
          );

          const cGroup = vData.reduce((acc, r) => {
            const k = r.country || "Unknown";
            acc[k] = (acc[k] || 0) + 1;
            return acc;
          }, {});
          setVisitCountries(
            Object.entries(cGroup)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
          );
        }

        // ── Everything else from download logs API ──
        const logs = logsRes?.data?.logs || [];
        if (logs.length > 0) {
          setTotalDownloads(logsRes?.data?.total || logs.length);

          // Downloads by country
          const dcGroup = logs.reduce((acc, r) => {
            const k = r.country || "Unknown";
            acc[k] = (acc[k] || 0) + 1;
            return acc;
          }, {});
          setDownloadCountries(
            Object.entries(dcGroup)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
          );

          // Platform breakdown (no Snapchat)
          const pGroup = logs.reduce((acc, r) => {
            const k = (r.platform || "Unknown").toLowerCase();
            if (k === "snapchat") return acc;
            acc[k] = (acc[k] || 0) + 1;
            return acc;
          }, {});
          setPlatformData(
            Object.entries(pGroup)
              .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count, fill: getPlatformColor(name) }))
              .sort((a, b) => b.count - a.count)
          );

          // Format breakdown
          const fGroup = logs.reduce((acc, r) => {
            const k = (r.format || "Unknown").toUpperCase();
            acc[k] = (acc[k] || 0) + 1;
            return acc;
          }, {});
          setFormatData(
            Object.entries(fGroup)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
          );

          // Downloads trend — last 7 days
          const days = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days[d.toISOString().slice(0, 10)] = 0;
          }
          logs.forEach((r) => {
            const day = (r.timestamp || r.created_at || "").slice(0, 10);
            if (days[day] !== undefined) days[day]++;
          });
          setVisitTrend(
            Object.entries(days).map(([date, downloads]) => ({ date: date.slice(5), downloads }))
          );

          // Recent 20 downloads
          setRecentDownloads(logs.slice(0, 20));
        }

        // Dashboard stats as fallback for totals
        const stats = statsRes?.data || {};
        if (vData.length === 0 && stats.total_downloads != null)
          setTotalDownloads(stats.total_downloads);

      } catch (e) {
        console.error("Visits load error:", e);
      }
      setLoading(false);
    }
    loadAll();
  }, []);

  const visitMax    = visitCountries[0]?.count    || 1;
  const downloadMax = downloadCountries[0]?.count || 1;

  function fmtTime(row) {
    const ts = row.timestamp || row.created_at;
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />
        <div className="admin-main-inner">

          <header className="admin-header">
            <div>
              <h1 className="admin-title">Visits</h1>
              <p className="admin-subtitle">Where your visitors come from and what they download.</p>
            </div>
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading data…</div>
          ) : (
            <>
              {/* ── Stat Cards ── */}
              <div className="admin-stats" style={{ marginBottom: "1.5rem" }}>
                {[
                  { icon: <Users size={18} />,    label: "Total Visits",      value: totalVisits.toLocaleString() },
                  { icon: <Clock size={18} />,    label: "Downloads Today",   value: todayVisits.toLocaleString() },
                  { icon: <Globe size={18} />,    label: "Visitor Countries", value: visitCountries.length || downloadCountries.length },
                  { icon: <Download size={18} />, label: "Total Downloads",   value: totalDownloads.toLocaleString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="admin-stat">
                    <div className="admin-stat-top"><div className="admin-stat-icon">{icon}</div></div>
                    <div className="admin-stat-label">{label}</div>
                    <div className="admin-stat-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* ── Country Bars ── */}
              <div className="admin-charts" style={{ marginBottom: "1.5rem" }}>
                <div className="admin-chart-card">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.25rem" }}>
                    <Globe size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin:0 }}>Visits by Country</h2>
                  </div>
                  {visitCountries.length === 0 ? (
                    <p style={{ color:"#94a3b8" }}>No visit data available from API.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {visitCountries.map((c) => (
                        <li key={c.name} className="analytics-country">
                          <div className="analytics-country-row">
                            <span className="analytics-country-name">{c.name}</span>
                            <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                          </div>
                          <div className="analytics-country-bar">
                            <div className="analytics-country-bar-fill" style={{ width:`${(c.count/visitMax)*100}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-chart-card">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.25rem" }}>
                    <MapPin size={18} color="#22c55e" />
                    <h2 className="admin-chart-title" style={{ margin:0 }}>Downloads by Country</h2>
                  </div>
                  {downloadCountries.length === 0 ? (
                    <p style={{ color:"#94a3b8" }}>No download country data yet.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {downloadCountries.map((c) => (
                        <li key={c.name} className="analytics-country">
                          <div className="analytics-country-row">
                            <span className="analytics-country-name">{c.name}</span>
                            <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                          </div>
                          <div className="analytics-country-bar">
                            <div className="analytics-country-bar-fill"
                              style={{ width:`${(c.count/downloadMax)*100}%`, background:"linear-gradient(90deg,#16a34a,#22c55e)" }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ── Downloads Trend (last 7 days) ── */}
              {visitTrend.some((d) => d.downloads > 0) && (
                <div className="admin-chart-card" style={{ marginBottom:"1.5rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.25rem" }}>
                    <TrendingUp size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin:0 }}>Downloads — Last 7 Days</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={visitTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="downloads" stroke="#22c55e" strokeWidth={2.5} dot={{ r:3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ── Platform + Format ── */}
              <div className="admin-charts" style={{ marginBottom:"1.5rem" }}>
                <div className="admin-chart-card">
                  <h2 className="admin-chart-title" style={{ marginBottom:"1rem" }}>Downloads by Platform</h2>
                  {platformData.length === 0 ? (
                    <p style={{ color:"#94a3b8" }}>No platform data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[6,6,0,0]}>
                          {platformData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="admin-chart-card">
                  <h2 className="admin-chart-title" style={{ marginBottom:"1rem" }}>Downloads by Format</h2>
                  {formatData.length === 0 ? (
                    <p style={{ color:"#94a3b8" }}>No format data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={formatData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[6,6,0,0]}>
                          {formatData.map((e, i) => <Cell key={i} fill={FORMAT_COLORS[i % FORMAT_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ── Recent Downloads Table ── */}
              {recentDownloads.length > 0 && (
                <div className="admin-table-card">
                  <h2 className="admin-chart-title" style={{ marginBottom:"1rem" }}>Recent Downloads</h2>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Country</th>
                          <th>Platform</th>
                          <th>Format</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDownloads.map((r, i) => (
                          <tr key={i}>
                            <td style={{ whiteSpace:"nowrap" }}>{fmtTime(r)}</td>
                            <td>{r.country || "Unknown"}</td>
                            <td>
                              <span style={{ background:getPlatformColor(r.platform||""), color:"#fff", padding:"2px 8px", borderRadius:4, fontSize:"0.8rem" }}>
                                {r.platform || "—"}
                              </span>
                            </td>
                            <td>
                              <span style={{ background:(r.format||"").toUpperCase()==="MP3"?"#22c55e":"#1d4ed8", color:"#fff", padding:"2px 8px", borderRadius:4, fontSize:"0.8rem" }}>
                                {r.format || "—"}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-status ${r.status==="success"?"ok":"fail"}`}>
                                {r.status === "success" ? "Completed" : (r.status || "—")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
