import {
  Users,
  TrendingUp,
  Activity,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";

const trafficData = [
  { day: "Mon", visits: 4200, downloads: 2100 },
  { day: "Tue", visits: 5100, downloads: 2800 },
  { day: "Wed", visits: 4800, downloads: 2500 },
  { day: "Thu", visits: 6200, downloads: 3100 },
  { day: "Fri", visits: 7500, downloads: 3600 },
  { day: "Sat", visits: 9000, downloads: 3800 },
  { day: "Sun", visits: 7200, downloads: 3400 },
];

const platformData = [
  { name: "TikTok", value: 4200, fill: "#0f172a" },
  { name: "Twitter", value: 3500, fill: "#ef4444" },
  { name: "Instagram", value: 2800, fill: "#ec4899" },
  { name: "Facebook", value: 3700, fill: "#1d4ed8" },
];

const recentDownloads = [
  { time: "2 mins ago", platform: "TikTok", format: "MP4 (1080p)", status: "Completed" },
  { time: "5 mins ago", platform: "Snapchat", format: "MP4 (720p)", status: "Completed" },
  { time: "12 mins ago", platform: "Instagram", format: "MP4 (720p)", status: "Failed" },
  { time: "18 mins ago", platform: "Facebook", format: "MP4 (1080p)", status: "Completed" },
];

export default function AdminDashboard() {
  const stats = [
    { label: "Total Visits", value: "124.5K", change: "+12.5%", up: true, icon: Users },
    { label: "Total Downloads", value: "84.2K", change: "+8.2%", up: true, icon: Download },
    { label: "Downloads Today", value: "3,240", change: "+24.1%", up: true, icon: TrendingUp },
    { label: "Active Users", value: "1,432", change: "-2.4%", up: false, icon: Activity },
  ];

  return (
    <div className="admin">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="admin-main-inner">
          <header className="admin-header">
            <div>
              <h1 className="admin-title">Dashboard Overview</h1>
              <p className="admin-subtitle">
                Welcome back, Admin. Here's what's happening today.
              </p>
            </div>
          </header>

          {/* Stat Cards */}
          <div className="admin-stats">
            {stats.map(({ label, value, change, up, icon: Icon }) => (
              <div key={label} className="admin-stat">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <Icon size={18} />
                  </div>
                  <span className={`admin-stat-change ${up ? "up" : "down"}`}>
                    {change}
                  </span>
                </div>
                <div className="admin-stat-label">{label}</div>
                <div className="admin-stat-value">{value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="admin-charts">
            <div className="admin-chart-card">
              <h2 className="admin-chart-title">
                Traffic &amp; Downloads (Last 7 Days)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="downloads" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card">
              <h2 className="admin-chart-title">Downloads by Platform</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Downloads */}
          <div className="admin-table-card">
            <h2 className="admin-chart-title">Recent Downloads</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Platform</th>
                    <th>Format</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDownloads.map((row, i) => (
                    <tr key={i}>
                      <td>{row.time}</td>
                      <td>{row.platform}</td>
                      <td>{row.format}</td>
                      <td>
                        <span className={`admin-status ${row.status === "Completed" ? "ok" : "fail"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}