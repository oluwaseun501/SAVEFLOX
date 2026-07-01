import { useState, useEffect } from "react";
import { Globe, Users, MapPin, Clock, Download } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { supabase } from "../lib/supabase";

export default function Visits() {
  const [countries, setCountries] = useState([]);
  const [downloadCountries, setDownloadCountries] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);
  const [email, setEmail] = useState("admin@saveflux.com");

  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      // Load visits data
      const { data: visitData, error: visitError } = await supabase
        .from("visitor_logs")
        .select("country, ip_address, created_at, user_agent")
        .order("created_at", { ascending: false });

      if (!visitError && visitData) {
        setTotalVisits(visitData.length);

        // Today's visits
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayCount = visitData.filter(
          (r) => r.created_at && r.created_at.slice(0, 10) === todayStr
        ).length;
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

        // Recent visitors (last 20)
        setRecentVisitors(visitData.slice(0, 20));
      }

      // Load download countries from download_logs
      const { data: dlData, error: dlError } = await supabase
        .from("download_logs")
        .select("country");

      if (!dlError && dlData) {
        const dlGrouped = dlData.reduce((acc, row) => {
          const key = row.country || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const dlSorted = Object.entries(dlGrouped)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setDownloadCountries(dlSorted);
      }

      setLoading(false);
    }

    loadAll();
  }, []);

  const visitMax = countries[0]?.count || 1;
  const dlMax = downloadCountries[0]?.count || 1;

  function formatTime(ts) {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function parseDevice(ua) {
    if (!ua) return "Unknown";
    if (/mobile|android|iphone|ipad/i.test(ua)) return "Mobile";
    if (/tablet/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  function parseBrowser(ua) {
    if (!ua) return "Unknown";
    if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
    if (/edge|edg/i.test(ua)) return "Edge";
    if (/opera|opr/i.test(ua)) return "Opera";
    return "Other";
  }

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar email={email} />
        <div className="admin-main-inner">
          <header className="admin-header">
            <div>
              <h1 className="admin-title">Visits</h1>
              <p className="admin-subtitle">
                Detailed breakdown of where your visitors come from and what they do.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading visit data...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="admin-stats" style={{ marginBottom: "1.5rem" }}>
                <StatCard
                  icon={<Users size={18} />}
                  label="Total Visits"
                  value={totalVisits.toLocaleString()}
                  tone="blue"
                />
                <StatCard
                  icon={<Clock size={18} />}
                  label="Visits Today"
                  value={todayVisits.toLocaleString()}
                  tone="green"
                />
                <StatCard
                  icon={<Globe size={18} />}
                  label="Unique Countries"
                  value={uniqueCountries.toLocaleString()}
                  tone="blue"
                />
                <StatCard
                  icon={<Download size={18} />}
                  label="Download Countries"
                  value={downloadCountries.length.toLocaleString()}
                  tone="green"
                />
              </div>

              {/* Two column: Visits by Country + Downloads by Country */}
              <div className="admin-charts" style={{ marginBottom: "1.5rem" }}>
                {/* Visits by Country */}
                <div className="admin-chart-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <Globe size={18} color="#1d4ed8" />
                    <h2 className="admin-chart-title" style={{ margin: 0 }}>Visits by Country</h2>
                  </div>
                  {countries.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No visit data yet.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {countries.map((c) => {
                        const pct = (c.count / visitMax) * 100;
                        return (
                          <li key={c.name} className="analytics-country">
                            <div className="analytics-country-row">
                              <span className="analytics-country-name">{c.name}</span>
                              <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                            </div>
                            <div className="analytics-country-bar">
                              <div className="analytics-country-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Downloads by Country */}
                <div className="admin-chart-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <MapPin size={18} color="#22c55e" />
                    <h2 className="admin-chart-title" style={{ margin: 0 }}>Downloads by Country</h2>
                  </div>
                  {downloadCountries.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No download country data yet.</p>
                  ) : (
                    <ul className="analytics-country-list">
                      {downloadCountries.map((c) => {
                        const pct = (c.count / dlMax) * 100;
                        return (
                          <li key={c.name} className="analytics-country">
                            <div className="analytics-country-row">
                              <span className="analytics-country-name">{c.name}</span>
                              <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                            </div>
                            <div className="analytics-country-bar">
                              <div
                                className="analytics-country-bar-fill"
                                style={{ width: `${pct}%`, background: "linear-gradient(90deg,#16a34a,#22c55e)" }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Recent Visitors Table */}
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
                            <td style={{ whiteSpace: "nowrap" }}>{formatTime(v.created_at)}</td>
                            <td>{v.country || "Unknown"}</td>
                            <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                              {v.ip_address || "—"}
                            </td>
                            <td>{parseDevice(v.user_agent)}</td>
                            <td>{parseBrowser(v.user_agent)}</td>
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

function StatCard({ icon, label, value, tone = "blue" }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-top">
        <div className={`admin-stat-icon${tone === "green" ? " green" : ""}`}>{icon}</div>
      </div>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
    </div>
  );
}
