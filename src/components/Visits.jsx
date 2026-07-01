import { useState, useEffect } from "react";
import { Globe, Users, Clock, Download } from "lucide-react";
import {
  LineChart, Line,
  BarChart, Bar,
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

/** Pull the date string (YYYY-MM-DD) from whichever timestamp column exists */
function getDate(row) {
  const raw = row.created_at || row.timestamp || row.visit_date || row.visited_at || "";
  return typeof raw === "string" ? raw.slice(0, 10) : "";
}

/** Pull the country from whichever column exists */
function getCountry(row) {
  return row.country || row.ip_country || row.visitor_country || row.location || "Unknown";
}

/** Build YYYY-MM-DD keys for the last N days */
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
  const [totalDownloads, setTotalDownloads] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      // ── 1. Pull all visitor_logs rows (select * avoids column-name errors) ──
      const { data: vData, error: vErr } = await supabase
        .from("visitor_logs")
        .select("*");

      if (vErr) {
        console.error("visitor_logs error:", vErr);
        setError("Could not load visitor data: " + vErr.message);
      } else if (vData && vData.length > 0) {
        const todayStr = new Date().toISOString().slice(0, 10);

        const days7  = lastNDays(7);
        const days30 = lastNDays(30);

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

        const last7Count  = Object.values(days7).reduce((a, b) => a + b, 0);
        const last30Count = Object.values(days30).reduce((a, b) => a + b, 0);

        setTotalVisits(vData.length);
        setTodayVisits(countToday);
        setLast7Visits(last7Count);
        setLast30Visits(last30Count);

        setTrend7(
          Object.entries(days7).map(([date, visits]) => ({
            date: date.slice(5), // "MM-DD"
            visits,
          }))
        );

        setTrend30(
          Object.entries(days30).map(([date, visits]) => ({
            date: date.slice(5),
            visits,
          }))
        );

        setVisitCountries(
          Object.entries(countryMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
        );
      }

      // ── 2. Total downloads from API (stat card only) ──
      try {
        const stats = await analyticsAPI.getDashboardStats();
        const d = stats?.data;
        setTotalDownloads(d?.total_downloads ?? d?.totalDownloads ?? null);
      } catch (_) {}

      setLoading(false);
    }

    load();
  }, []);

  const visitMax = visitCountries[0]?.count || 1;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <div className="admin-page-header">
            <div>
              <h1 className="admin-page-title">Visits</h1>
              <p className="admin-subtitle">Where your visitors come from and how often they visit.</p>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", color: "#dc2626", marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
            <StatCard icon={<Users size={18} />} label="Total Visits" value={loading ? "…" : totalVisits.toLocaleString()} />
            <StatCard icon={<Clock size={18} />} label="Visitors Today" value={loading ? "…" : todayVisits.toLocaleString()} />
            <StatCard icon={<Clock size={18} />} label="Last 7 Days" value={loading ? "…" : last7Visits.toLocaleString()} />
            <StatCard icon={<Clock size={18} />} label="Last 30 Days" value={loading ? "…" : last30Visits.toLocaleString()} />
          </div>

          {/* ── Second row: Countries + Total Downloads ─────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 28, alignItems: "start" }}>
            {/* Visits by Country */}
            <div className="analytics-card">
              <h3 className="analytics-card-title">
                <Globe size={16} /> Visits by Country
              </h3>
              {loading ? (
                <p style={{ color: "#94a3b8", padding: "12px 0" }}>Loading…</p>
              ) : visitCountries.length === 0 ? (
                <p style={{ color: "#94a3b8", padding: "12px 0" }}>No visitor country data yet.</p>
              ) : (
                <div className="analytics-country-list">
                  {visitCountries.slice(0, 15).map((c) => (
                    <div key={c.name} className="analytics-country-row">
                      <span className="analytics-country-name">{c.name}</span>
                      <div className="analytics-country-bar-wrap">
                        <div
                          className="analytics-country-bar-fill"
                          style={{ width: `${(c.count / visitMax) * 100}%` }}
                        />
                      </div>
                      <span className="analytics-country-count">{c.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Downloads card */}
            {totalDownloads !== null && (
              <div className="analytics-card" style={{ minWidth: 180, textAlign: "center" }}>
                <h3 className="analytics-card-title" style={{ justifyContent: "center" }}>
                  <Download size={16} /> Total Downloads
                </h3>
                <p style={{ fontSize: 36, fontWeight: 700, color: "#1d4ed8", margin: "16px 0 4px" }}>
                  {totalDownloads.toLocaleString()}
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>all time</p>
              </div>
            )}
          </div>

          {/* ── Visits – Last 7 Days ────────────────────────────────────── */}
          {!loading && trend7.some((d) => d.visits > 0) && (
            <div className="analytics-card" style={{ marginBottom: 24 }}>
              <h3 className="analytics-card-title">
                <Clock size={16} /> Visits — Last 7 Days
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trend7} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Visits – Last 30 Days ───────────────────────────────────── */}
          {!loading && trend30.some((d) => d.visits > 0) && (
            <div className="analytics-card">
              <h3 className="analytics-card-title">
                <Clock size={16} /> Visits — Last 30 Days
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trend30} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v, i) => i % 5 === 0 ? v : ""} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
      </div>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}
