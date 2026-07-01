import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import { supabase } from "../lib/supabase";

export default function AdPerformance() {
  const [adClicks, setAdClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdClicks() {
      setLoading(true);
      const { data, error } = await supabase
        .from("ad_clicks")
        .select("slot, link, clicked_at")
        .order("clicked_at", { ascending: false });

      if (!error && data) {
        // Group by slot + link combo
        const grouped = data.reduce((acc, row) => {
          const key = `${row.slot}||${row.link}`;
          if (!acc[key]) {
            acc[key] = {
              slot: row.slot,
              link: row.link,
              clicks: 0,
              lastClicked: row.clicked_at,
            };
          }
          acc[key].clicks++;
          return acc;
        }, {});
        setAdClicks(Object.values(grouped));
      }
      setLoading(false);
    }
    loadAdClicks();
  }, []);

  const pages = [
    { label: "Home Page",     prefixes: ["home"] },
    { label: "TikTok Page",   prefixes: ["tiktok"] },
    { label: "Twitter Page",  prefixes: ["twitter"] },
    { label: "Facebook Page", prefixes: ["facebook"] },
    { label: "Instagram Page",prefixes: ["instagram"] },
    { label: "Pinterest Page",prefixes: ["pinterest"] },
    { label: "MP3 Converter", prefixes: ["mp3"] },
  ];

  const totalClicks = adClicks.reduce((sum, r) => sum + r.clicks, 0);

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />
        <div className="admin-main-inner">
          <header className="admin-header">
            <div>
              <h1 className="admin-title">Ads Performance</h1>
              <p className="admin-subtitle">
                Track ad slot clicks, backlinks, and last-click times across every page.
              </p>
            </div>
            {!loading && (
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                <strong style={{ color: "#1d4ed8" }}>{totalClicks.toLocaleString()}</strong> total clicks recorded
              </div>
            )}
          </header>

          {loading ? (
            <div className="admin-loading-card">Loading ad performance data...</div>
          ) : adClicks.length === 0 ? (
            <p style={{ color: "#94a3b8", marginTop: "2rem" }}>No ad clicks recorded yet.</p>
          ) : (
            <div className="ad-perf-grid">
              {pages.map(({ label, prefixes }) => {
                const rows = adClicks.filter((r) =>
                  prefixes.some((p) => r.slot.startsWith(p))
                );
                if (rows.length === 0) return null;
                const pageClicks = rows.reduce((sum, r) => sum + r.clicks, 0);

                return (
                  <div className="ad-perf-card" key={label}>
                    <div className="ad-perf-card-header">
                      <span className="ad-perf-page">{label}</span>
                      <span className="ad-perf-total">{pageClicks} clicks</span>
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
                            <td>
                              <strong>{row.clicks}</strong>
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {row.link && row.link !== "none" ? (
                                <a
                                  href={row.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#1d4ed8",
                                    textDecoration: "underline",
                                    wordBreak: "break-all",
                                  }}
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
      </main>
    </div>
  );
}
