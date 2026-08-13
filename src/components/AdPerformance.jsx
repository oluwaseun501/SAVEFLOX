import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../styles/AdminDashboard.css";
import { supabase } from "../lib/supabase";

const DATE_RANGES = [
  { value: "7", label: "Last 7 days", days: 7 },
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "90", label: "Last 90 days", days: 90 },
];

const SLOT_ORDER = [
  "home-top",
  "home-middle",
  "home-bottom",
  "tiktok-top",
  "tiktok-middle",
  "tiktok-bottom",
  "twitter-top",
  "twitter-middle",
  "twitter-bottom",
  "facebook-top",
  "facebook-middle",
  "facebook-bottom",
  "instagram-top",
  "instagram-middle",
  "instagram-bottom",
  "pinterest-top",
  "pinterest-middle",
  "pinterest-bottom",
  "course-link",
  "popup-image",
  "popup-video",
];

function getDate(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value) {
  const date = getDate(value);
  return date ? date.toLocaleString() : "Unknown time";
}

function formatSlotLabel(slot) {
  return slot
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isRealLink(link) {
  return Boolean(link && link !== "none" && link !== "#");
}

function getRangeBounds(range, customStart, customEnd) {
  if (range === "custom") {
    if (!customStart || !customEnd) return { pending: true };

    const start = new Date(`${customStart}T00:00:00`);
    const end = new Date(`${customEnd}T23:59:59.999`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return { invalid: true };
    }

    return { start, end };
  }

  const selectedRange = DATE_RANGES.find((item) => item.value === range);
  if (!selectedRange) return null;

  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (selectedRange.days - 1));

  return { start, end };
}

function getRangeLabel(range, customStart, customEnd) {
  if (range === "custom") {
    if (customStart && customEnd) {
      return `${customStart} to ${customEnd}`;
    }
    return "Choose a date range";
  }

  return (
    DATE_RANGES.find((item) => item.value === range)?.label || "Last 30 days"
  );
}

function buildSlotGroups(rows) {
  const groups = new Map();

  rows.forEach((row) => {
    const slot = row.slot || "unknown-slot";
    const link = row.link || "none";

    if (!groups.has(slot)) {
      groups.set(slot, {
        slot,
        rows: [],
        links: new Map(),
      });
    }

    const group = groups.get(slot);
    group.rows.push(row);

    if (!group.links.has(link)) {
      group.links.set(link, {
        link,
        clicks: 0,
        times: [],
      });
    }

    const linkGroup = group.links.get(link);
    linkGroup.clicks += 1;
    if (row.clicked_at) linkGroup.times.push(row.clicked_at);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      links: Array.from(group.links.values()).sort(
        (a, b) => b.clicks - a.clicks,
      ),
      lastClicked:
        group.rows
          .map((row) => getDate(row.clicked_at))
          .filter(Boolean)
          .sort((a, b) => b.getTime() - a.getTime())[0] || null,
    }))
    .sort((a, b) => {
      const aIndex = SLOT_ORDER.indexOf(a.slot);
      const bIndex = SLOT_ORDER.indexOf(b.slot);

      if (aIndex === -1 && bIndex === -1) {
        return a.slot.localeCompare(b.slot);
      }
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}

function ClickDetails({ group }) {
  return (
    <div className="ad-details-content">
      <div className="ad-details-summary">
        <span>
          <strong>{group.rows.length.toLocaleString()}</strong> total clicks
        </span>
        <span>
          <strong>{group.links.length.toLocaleString()}</strong>{" "}
          {group.links.length === 1 ? "backlink" : "backlinks"}
        </span>
      </div>

      <div className="ad-details-list">
        {group.links.map((linkGroup) => (
          <div
            className="ad-detail-row"
            key={`${group.slot}-${linkGroup.link}`}
          >
            <div className="ad-detail-row-top">
              <div className="ad-detail-backlink">
                {isRealLink(linkGroup.link) ? (
                  <a
                    href={linkGroup.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkGroup.link}
                  </a>
                ) : (
                  <span className="ad-muted">No backlink</span>
                )}
              </div>
              <span className="ad-detail-click-count">
                {linkGroup.clicks.toLocaleString()}{" "}
                {linkGroup.clicks === 1 ? "click" : "clicks"}
              </span>
            </div>

            <div className="ad-detail-times">
              {linkGroup.times.length > 0 ? (
                linkGroup.times
                  .slice()
                  .sort(
                    (a, b) =>
                      (getDate(b)?.getTime() || 0) -
                      (getDate(a)?.getTime() || 0),
                  )
                  .map((clickedAt, index) => (
                    <time dateTime={clickedAt} key={`${clickedAt}-${index}`}>
                      {formatDateTime(clickedAt)}
                    </time>
                  ))
              ) : (
                <span className="ad-muted">No click time available</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotCard({ group, onOpen }) {
  return (
    <article className="ad-slot-card">
      <button
        className="ad-slot-card-trigger"
        type="button"
        onClick={() => onOpen(group)}
        aria-label={`View details for ${formatSlotLabel(group.slot)}`}
      >
        <div className="ad-slot-card-header">
          <div>
            <span className="ad-slot-label">{formatSlotLabel(group.slot)}</span>
            <span className="ad-slot-code">{group.slot}</span>
          </div>
          <span className="ad-slot-total">
            {group.rows.length.toLocaleString()} clicks
          </span>
        </div>

        <div className="ad-slot-card-footer">
          <span className="ad-slot-last-click-label">Last click</span>
          <time dateTime={group.lastClicked?.toISOString()}>
            {group.lastClicked
              ? group.lastClicked.toLocaleString()
              : "No click time"}
          </time>
        </div>
      </button>

      <div className="ad-slot-hover-panel" aria-label={`${group.slot} details`}>
        <div className="ad-hover-heading">
          <span>{formatSlotLabel(group.slot)} details</span>
          <span>Hover card · scroll to view</span>
        </div>
        <ClickDetails group={group} />
      </div>
    </article>
  );
}

export default function AdPerformance() {
  const [adClicks, setAdClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("30");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAdClicks() {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from("ad_clicks")
        .select("slot, link, clicked_at")
        .order("clicked_at", { ascending: false });

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message || "Unable to load ad performance data.");
        setAdClicks([]);
      } else {
        setAdClicks(data || []);
      }

      setLoading(false);
    }

    loadAdClicks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedGroup) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedGroup(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedGroup]);

  const rangeBounds = useMemo(
    () => getRangeBounds(range, customStart, customEnd),
    [range, customStart, customEnd],
  );

  const filteredClicks = useMemo(() => {
    if (rangeBounds?.invalid || rangeBounds?.pending) return [];
    if (!rangeBounds) return adClicks;

    return adClicks.filter((row) => {
      const clickedAt = getDate(row.clicked_at);
      return (
        clickedAt &&
        clickedAt >= rangeBounds.start &&
        clickedAt <= rangeBounds.end
      );
    });
  }, [adClicks, rangeBounds]);

  const slotGroups = useMemo(
    () => buildSlotGroups(filteredClicks),
    [filteredClicks],
  );

  const isInvalidCustomRange = range === "custom" && rangeBounds?.invalid;
  const rangeLabel = getRangeLabel(range, customStart, customEnd);
  const totalClicks = filteredClicks.length;

  return (
    <div className="admin">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar email="admin@saveflux.com" />

        <div className="admin-main-inner">
          <header className="admin-header ad-performance-header">
            <div>
              <h1 className="admin-title">Ads Performance</h1>
              <p className="admin-subtitle">
                Track clicks by exact ad slot, backlink, and click time.
              </p>
            </div>

            {!loading && !error && (
              <div className="ad-total-summary">
                <strong>{totalClicks.toLocaleString()}</strong>
                <span>clicks in {rangeLabel.toLowerCase()}</span>
              </div>
            )}
          </header>

          <section
            className="ad-filter-bar"
            aria-label="Ad performance date filters"
          >
            <div className="ad-filter-heading">
              <span className="ad-filter-eyebrow">Date range</span>
              <span className="ad-filter-current">{rangeLabel}</span>
            </div>

            <div className="ad-filter-controls">
              <div
                className="ad-filter-presets"
                role="group"
                aria-label="Choose date range"
              >
                {DATE_RANGES.map((item) => (
                  <button
                    className={range === item.value ? "active" : ""}
                    key={item.value}
                    type="button"
                    onClick={() => setRange(item.value)}
                    aria-pressed={range === item.value}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className={range === "custom" ? "active" : ""}
                  type="button"
                  onClick={() => setRange("custom")}
                  aria-pressed={range === "custom"}
                >
                  Custom
                </button>
              </div>

              {range === "custom" && (
                <div className="ad-custom-dates">
                  <label>
                    From
                    <input
                      type="date"
                      value={customStart}
                      onChange={(event) => setCustomStart(event.target.value)}
                    />
                  </label>
                  <label>
                    To
                    <input
                      type="date"
                      value={customEnd}
                      min={customStart || undefined}
                      onChange={(event) => setCustomEnd(event.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          </section>

          {isInvalidCustomRange && (
            <p className="ad-filter-error" role="alert">
              The end date must be the same as or after the start date.
            </p>
          )}

          {loading ? (
            <div className="admin-loading-card">
              Loading ad performance data...
            </div>
          ) : error ? (
            <div className="ad-error-card" role="alert">
              <strong>Could not load ad performance data.</strong>
              <span>{error}</span>
            </div>
          ) : slotGroups.length === 0 ? (
            <div className="ad-empty-card">
              <strong>No clicks found for this date range.</strong>
              <span>Try another filter or choose a wider custom range.</span>
            </div>
          ) : (
            <div className="ad-perf-grid">
              {slotGroups.map((group) => (
                <SlotCard
                  group={group}
                  key={group.slot}
                  onOpen={setSelectedGroup}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedGroup && (
        <div
          className="ad-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedGroup(null)}
        >
          <section
            className="ad-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ad-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ad-modal-header">
              <div>
                <span className="ad-filter-eyebrow">Slot details</span>
                <h2 id="ad-modal-title">
                  {formatSlotLabel(selectedGroup.slot)}
                </h2>
                <span className="ad-slot-code">{selectedGroup.slot}</span>
              </div>
              <button
                className="ad-modal-close"
                type="button"
                onClick={() => setSelectedGroup(null)}
                aria-label="Close slot details"
              >
                ×
              </button>
            </div>
            <ClickDetails group={selectedGroup} />
          </section>
        </div>
      )}
    </div>
  );
}
