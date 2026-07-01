import { useState, useEffect } from "react";
import { Globe, Users, MapPin, Clock, Download } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { supabase } from "../lib/supabase";
import { analyticsAPI } from "../services/api";

export default function Visits() {
  const [countries, setCountries] = useState([]);
  const [downloadCountries, setDownloadCountries] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      // ── Visitor logs (select * to match whatever columns exist) ──
      const { data: visitData, error: visitError } = await supabase
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (!visitError && visitData && visitData.length > 0) {
        setTotalVisits(visitData.length);

        // Today's visits – try created_at, fall back to timestamp
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayCount = visitData.filter((r) => {
          const ts = r.created_at || r.timestamp || "";
          return ts.slice(0, 10) === todayStr;
        }).length;
        setTodayVisits(todayCount);

        // Group by country
        const grouped = visitData.reduce((acc, row) => {
          const key = row.country || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(grouped)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setCountries(sorted);
        setUniqueCountries(sorted.length);

        // Recent visitors (last 20 rows)
        setRecentVisitors(visitData.slice(0, 20));
      } else {
        // visitError present — log for debugging
        if (visitError) console.error("visitor_logs error:", visitError.message);
      }

      // ── Downloads by country via existing API ──
      try {
        const dlRes = await analyticsAPI.getDownloadLogs(1000, 0, {});
        const dlLogs = dlRes?.data?.logs || [];
        const dlGrouped = dlLogs.reduce((acc, row) => {
          const key = row.country || "Unknown";
          if (!key || key === "Unknown") return acc;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const dlSorted = Object.entries(dlGrouped)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setDownloadCountries(dlSorted);
      } catch (e) {
        console.error("download logs error:", e);
      }

      setLoading(false);
    }

    loadAll();
  }, []);

  const visitMax = countries[0]?.count || 1;
  const dlMax = downloadCountries[0]?.count || 1;

  function formatTime(row) {
    const ts = row.created_at || row.timestamp;
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function parseDevice(ua) {
    if (!ua) return "—";
    if (/mobile|android|iphone|ipad/i.test(ua)) return "Mobile";
    if (/tablet/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  function parseBrowser(ua) {
    if (!ua) return "—";
    if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
    if (/edge|edg/i.test(ua)) return "Edge";
    if (/opera|opr/i.test(ua)) return "Opera";
    return "Other";
  }

  // Detect which IP column exists from the first visitor row
  function getIp(row) {
    return row.ip_address || row.ip || "—";
  }

  // Detect which user-agent column exists
  function getUa(row) {
    return row.user_agent || row.useragent || row.ua || "";
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
              <p className="admin-subtitle">
                Detailed breakdown of where your visitors come from and what they download.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading visit data...</div>
          ) : (
            <>
              {/* ── Stat Cards ── */}
              <div className="admin-stats" style={{ marginBottom: "1.5rem" }}>
                <div className="admin-stat">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon"><Users size={18} /></div>
                  </div>
                  <div className="admin-stat-label">Total Visits</div>
                  <div className="admin-stat-value">{totalVisits.toLocaleString()}</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon"><Clock size={18} /></div>
                  </div>
                  <div className="admin-stat-label">Visits Today</div>
                  <div className="admin-stat-value">{todayVisits.toLocaleString()}</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon"><Globe size={18} /></div>
                  </div>
                  <div className="admin-stat-label">Unique Countries</div>
                  <div className="admin-stat-value">{uniqueCountries.toLocaleString()}</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon"><Download size={18} /></div>
                  </div>
                  <div className="admin-stat-label">Download Countries</div>
                  <div className="admin-stat-value">{downloadCountries.length.toLocaleString()}</div>
                </div>
              </div>

              {/* ── Two-column: Visits by Country + Downloads by Country ── */}
              <div className="admin-charts" style={{ marginBottom: "1.5rem" }}>
                <div className="admin-chart-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <Globe size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin: 0 }}>Visits by Country</h2>
                  </div>
                  {countries.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No visit data yet.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {countries.map((c) => (
                        <li key={c.name} className="analytics-country">
                          <div className="analytics-country-row">
                            <span className="analytics-country-name">{c.name}</span>
                            <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                          </div>
                          <div className="analytics-country-bar">
                            <div
                              className="analytics-country-bar-fill"
                              style={{ width: `${(c.count / visitMax) * 100}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-chart-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <MapPin size={18} color="#22c55e" />
                    <h2 className="admin-chart-title" style={{ margin: 0 }}>Downloads by Country</h2>
                  </div>
                  {downloadCountries.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No download country data yet.</p>
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
                              style={{
                                width: `${(c.count / dlMax) * 100}%`,
                                background: "linear-gradient(90deg,#16a34a,#22c55e)",
                              }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ── Recent Visitors Table ── */}
              <div className="admin-table-card">
                <h2 className="admin-chart-title" style={{ marginBottom: "1rem" }}>
                  Recent Visitors
                </h2>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Country</th>
                        <th>IP Address</th>
                        <th>Device</th>
                        <th>Browser</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVisitors.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                            No recent visitor data.
                          </td>
                        </tr>
                      ) : (
                        recentVisitors.map((v, i) => (
                          <tr key={i}>
                            <td style={{ whiteSpace: "nowrap" }}>{formatTime(v)}</td>
                            <td>{v.country || "Unknown"}</td>
                            <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                              {getIp(v)}
                            </td>
                            <td>{parseDevice(getUa(v))}</td>
                            <td>{parseBrowser(getUa(v))}</td>
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
