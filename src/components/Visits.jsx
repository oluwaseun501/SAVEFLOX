import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import "../styles/Analytics.css";
import { supabase } from "../lib/supabase";

export default function Visits() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    async function loadVisits() {
      setLoading(true);
      const { data, error } = await supabase
        .from("visitor_logs")
        .select("country");

      if (!error && data) {
        setTotalVisits(data.length);
        const grouped = data.reduce((acc, row) => {
          const key = row.country || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(grouped)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setCountries(sorted);
      }
      setLoading(false);
    }
    loadVisits();
  }, []);

  const max = countries[0]?.count || 1;

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
                Countries your visitors are accessing the site from.
              </p>
            </div>
            {!loading && (
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                <strong style={{ color: "#1d4ed8" }}>{totalVisits.toLocaleString()}</strong> total visits tracked
              </div>
            )}
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading visit data...</div>
          ) : countries.length === 0 ? (
            <p style={{ color: "#94a3b8", marginTop: "2rem" }}>No visit data recorded yet.</p>
          ) : (
            <div className="admin-chart-card" style={{ marginTop: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "1.25rem",
                }}
              >
                <Globe size={18} color="#1d4ed8" />
                <h2 className="admin-chart-title" style={{ margin: 0 }}>
                  Visits by Country
                </h2>
              </div>
              <ul className="analytics-country-list">
                {countries.map((c) => {
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
                })}
              </ul>
            </div>

          )}
        </div>
      </main>
    </div>
  );
}
