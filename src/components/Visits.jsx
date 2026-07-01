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
import { supabase } from "../lib/supabase";

const PLATFORM_COLORS = {
  tiktok:    "#0f172a",
  instagram: "#ec4899",
  twitter:   "#1d4ed8",
  facebook:  "#2563eb",
  pinterest: "#ef4444",
  youtube:   "#dc2626",
};

function getPlatformColor(name = "") {
  return PLATFORM_COLORS[name.toLowerCase()] || "#94a3b8";
}

export default function Visits() {
  const [visitCountries,    setVisitCountries]    = useState([]);
  const [downloadCountries, setDownloadCountries] = useState([]);
  const [visitTrend,        setVisitTrend]        = useState([]);
  const [platformData,      setPlatformData]      = useState([]);
  const [formatData,        setFormatData]        = useState([]);
  const [recentDownloads,   setRecentDownloads]   = useState([]);
  const [totalVisits,       setTotalVisits]       = useState(0);
  const [todayVisits,       setTodayVisits]       = useState(0);
  const [totalDownloads,    setTotalDownloads]    = useState(0);
  const [loading,           setLoading]           = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      // ── visitor_logs ──────────────────────────────────────────────────────
      const { data: vData } = await supabase
        .from("visitor_logs")
        .select("country, created_at, timestamp");

      if (vData && vData.length > 0) {
        setTotalVisits(vData.length);

        // today
        const todayStr = new Date().toISOString().slice(0, 10);
        setTodayVisits(
          vData.filter((r) => (r.created_at || r.timestamp || "").slice(0, 10) === todayStr).length
        );

        // visits by country
        const cGroup = vData.reduce((acc, r) => {
          const k = r.country || "Unknown";
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {});
        setVisitCountries(
          Object.entries(cGroup).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
        );

        // visits over last 7 days
        const days = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days[d.toISOString().slice(0, 10)] = 0;
        }
        vData.forEach((r) => {
          const day = (r.created_at || r.timestamp || "").slice(0, 10);
          if (days[day] !== undefined) days[day]++;
        });
        setVisitTrend(
          Object.entries(days).map(([date, visits]) => ({
            date: date.slice(5), // MM-DD
            visits,
          }))
        );
      }

      // ── download_logs ─────────────────────────────────────────────────────
      const { data: dData } = await supabase
        .from("download_logs")
        .select("country, platform, format, timestamp, created_at, status, url")
        .order("id", { ascending: false })
        .limit(500);

      if (dData && dData.length > 0) {
        setTotalDownloads(dData.length);

        // downloads by country
        const dcGroup = dData.reduce((acc, r) => {
          const k = r.country || "Unknown";
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {});
        setDownloadCountries(
          Object.entries(dcGroup).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
        );

        // downloads by platform (filter snapchat)
        const pGroup = dData.reduce((acc, r) => {
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

        // MP4 vs MP3
        const fGroup = dData.reduce((acc, r) => {
          const k = (r.format || "Unknown").toUpperCase();
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {});
        setFormatData(
          Object.entries(fGroup)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
        );

        // recent 20 downloads
        setRecentDownloads(dData.slice(0, 20));
      }

      setLoading(false);
    }
    loadAll();
  }, []);

  const visitMax    = visitCountries[0]?.count    || 1;
  const downloadMax = downloadCountries[0]?.count || 1;

  function fmtTime(row) {
    const ts = row.created_at || row.timestamp;
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  const FORMAT_COLORS = ["#1d4ed8", "#22c55e", "#f59e0b", "#ec4899"];

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />
        <div className="admin-main-inner">

          <header className="admin-header">
            <div>
              <h1 className="admin-title">Visits</h1>
              <p className="admin-subtitle">
                Where your visitors come from and what they download.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading data…</div>
          ) : (
            <>
              {/* ── Stat Cards ─────────────────────────────────────────────── */}
              <div className="admin-stats" style={{ marginBottom: "1.5rem" }}>
                {[
                  { icon: <Users size={18} />,    label: "Total Visits",      value: totalVisits.toLocaleString() },
                  { icon: <Clock size={18} />,    label: "Visits Today",      value: todayVisits.toLocaleString() },
                  { icon: <Globe size={18} />,    label: "Visitor Countries", value: visitCountries.length },
                  { icon: <Download size={18} />, label: "Total Downloads",   value: totalDownloads.toLocaleString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="admin-stat">
                    <div className="admin-stat-top"><div className="admin-stat-icon">{icon}</div></div>
                    <div className="admin-stat-label">{label}</div>
                    <div className="admin-stat-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* ── Country Bars ───────────────────────────────────────────── */}
              <div className="admin-charts" style={{ marginBottom: "1.5rem" }}>

                <div className="admin-chart-card">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.25rem" }}>
                    <Globe size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin:0 }}>Visits by Country</h2>
                  </div>
                  {visitCountries.length === 0 ? (
                    <p style={{ color:"#94a3b8" }}>No visit data yet.</p>
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
                    <p style={{ color:"#94a3b8" }}>No download data yet.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {downloadCountries.map((c) => (
                        <li key={c.name} className="analytics-country">
                          <div className="analytics-country-row">
                            <span className="analytics-country-name">{c.name}</span>
                            <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                          </div>
                          <div className="analytics-country-bar">
                            <div
                              className="analytics-country-bar-fill"
                              style={{ width:`${(c.count/downloadMax)*100}%`, background:"linear-gradient(90deg,#16a34a,#22c55e)" }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* ── Visits Trend (last 7 days) ─────────────────────────────── */}
              {visitTrend.length > 0 && (
                <div className="admin-chart-card" style={{ marginBottom:"1.5rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.25rem" }}>
                    <TrendingUp size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin:0 }}>Visits — Last 7 Days</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={visitTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r:3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ── Platform + Format charts ───────────────────────────────── */}
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
                          {platformData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
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
                          {formatData.map((entry, i) => (
                            <Cell key={i} fill={FORMAT_COLORS[i % FORMAT_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

              </div>

              {/* ── Recent Downloads Table ─────────────────────────────────── */}
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
                      {recentDownloads.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign:"center", color:"#94a3b8", padding:"2rem" }}>
                            No recent download data.
                          </td>
                        </tr>
                      ) : (
                        recentDownloads.map((r, i) => (
                          <tr key={i}>
                            <td style={{ whiteSpace:"nowrap" }}>{fmtTime(r)}</td>
                            <td>{r.country || "Unknown"}</td>
                            <td>
                              <span style={{
                                background: getPlatformColor(r.platform || ""),
                                color:"#fff",
                                padding:"2px 8px",
                                borderRadius:4,
                                fontSize:"0.8rem",
                              }}>
                                {r.platform || "—"}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                background: (r.format||"").toUpperCase() === "MP3" ? "#22c55e" : "#1d4ed8",
                                color:"#fff",
                                padding:"2px 8px",
                                borderRadius:4,
                                fontSize:"0.8rem",
                              }}>
                                {r.format || "—"}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-status ${r.status === "success" ? "ok" : "fail"}`}>
                                {r.status === "success" ? "Completed" : (r.status || "—")}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          )}
        </div>
      </main>
    </div>
  );
}
