import { useState, useEffect } from "react";
import { Globe, Users, Clock, Download, TrendingUp, Activity } from "lucide-react";
import {
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { supabase } from "../lib/supabase";
import { analyticsAPI } from "../services/api";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Pull a date string (YYYY-MM-DD) from whichever column exists */
function getDate(row) {
  const raw = row.created_at || row.timestamp || row.visit_date || row.visited_at || "";
  return typeof raw === "string" ? raw.slice(0, 10) : "";
}

/** Pull country from whichever column exists */
function getCountry(row) {
  return (row.country || row.ip_country || row.visitor_country || row.location || "Unknown").trim() || "Unknown";
}

/** Build an ordered map of YYYY-MM-DD → 0 for the last N days */
function lastNDays(n) {
  const days = {};
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days[d.toISOString().slice(0, 10)] = 0;
  }
  return days;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Visits() {
  const [visitCountries, setVisitCountries] = useState([]);
  const [trend7,         setTrend7]         = useState([]);
  const [trend30,        setTrend30]        = useState([]);
  const [totalVisits,    setTotalVisits]    = useState(0);
  const [todayVisits,    setTodayVisits]    = useState(0);
  const [last7Visits,    setLast7Visits]    = useState(0);
  const [last30Visits,   setLast30Visits]   = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // ── visitor_logs via Supabase (select * avoids column-name errors) ──
      const { data: vData } = await supabase
        .from("visitor_logs")
        .select("*");

      if (vData && vData.length > 0) {
        const todayStr = new Date().toISOString().slice(0, 10);
        const days7    = lastNDays(7);
        const days30   = lastNDays(30);
        let countToday = 0;
        const countryMap = {};

        vData.forEach((row) => {
          const day     = getDate(row);
          const country = getCountry(row);

          if (day === todayStr) countToday++;
          if (days7[day]  !== undefined) days7[day]++;
          if (days30[day] !== undefined) days30[day]++;
          countryMap[country] = (countryMap[country] || 0) + 1;
        });

        setTotalVisits(vData.length);
        setTodayVisits(countToday);
        setLast7Visits(Object.values(days7).reduce((a, b) => a + b, 0));
        setLast30Visits(Object.values(days30).reduce((a, b) => a + b, 0));

        setTrend7(
          Object.entries(days7).map(([date, visits]) => ({ date: date.slice(5), visits }))
        );
        setTrend30(
          Object.entries(days30).map(([date, visits]) => ({ date: date.slice(5), visits }))
        );
        setVisitCountries(
          Object.entries(countryMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
        );
      }

      // ── total downloads from API ──
      try {
        const res = await analyticsAPI.getDashboardStats();
        const d   = res?.data;
        const td  = d?.total_downloads ?? d?.totalDownloads ?? 0;
        setTotalDownloads(td);
      } catch (_) {}

      setLoading(false);
    }

    load();
  }, []);

  const statsList = [
    { label: "Total Visits",    value: loading ? "…" : totalVisits.toLocaleString(),    icon: Users     },
    { label: "Visitors Today",  value: loading ? "…" : todayVisits.toLocaleString(),    icon: Clock     },
    { label: "Last 7 Days",     value: loading ? "…" : last7Visits.toLocaleString(),    icon: TrendingUp },
    { label: "Last 30 Days",    value: loading ? "…" : last30Visits.toLocaleString(),   icon: Activity  },
    { label: "Total Downloads", value: loading ? "…" : totalDownloads.toLocaleString(), icon: Download  },
  ];

  const visitMax = visitCountries[0]?.count || 1;

  return (
    <div className="admin">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar />

        <div className="admin-main-inner">
          <header className="admin-header">
            <div>
              <h1 className="admin-title">Visits</h1>
              <p className="admin-subtitle">Where your visitors come from and how often they visit.</p>
            </div>
          </header>

          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <div className="admin-stats">
            {statsList.map(({ label, value, icon: Icon }) => (
              <div key={label} className="admin-stat">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon"><Icon size={18} /></div>
                </div>
                <div className="admin-stat-label">{label}</div>
                <div className="admin-stat-value">{value}</div>
              </div>
            ))}
          </div>

          {/* ── Visits by Country ──────────────────────────────────────── */}
          <div className="admin-charts" style={{ marginTop: 24 }}>
            <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
              <h2 className="admin-chart-title">
                <Globe size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Visits by Country
              </h2>

              {loading ? (
                <p style={{ color: "#94a3b8" }}>Loading…</p>
              ) : visitCountries.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No visitor data yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                  {visitCountries.slice(0, 15).map((c) => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 130, fontSize: 13, color: "#334155", flexShrink: 0 }}>{c.name}</span>
                      <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 10, overflow: "hidden" }}>
                        <div style={{
                          width: `${(c.count / visitMax) * 100}%`,
                          height: "100%",
                          background: "#1d4ed8",
                          borderRadius: 4,
                        }} />
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: "#64748b", textAlign: "right" }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Visits — Last 7 Days ───────────────────────────────────── */}
          {!loading && trend7.some((d) => d.visits > 0) && (
            <div className="admin-charts" style={{ marginTop: 24 }}>
              <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
                <h2 className="admin-chart-title">Visits — Last 7 Days</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trend7} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── Visits — Last 30 Days ──────────────────────────────────── */}
          {!loading && trend30.some((d) => d.visits > 0) && (
            <div className="admin-charts" style={{ marginTop: 24 }}>
              <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
                <h2 className="admin-chart-title">Visits — Last 30 Days</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trend30} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12}
                      tickFormatter={(v, i) => i % 5 === 0 ? v : ""} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
