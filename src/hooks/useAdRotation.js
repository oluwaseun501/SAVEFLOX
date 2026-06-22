// src/hooks/useAdRotation.js
import { useMemo } from "react";
import { ADS } from "../config/adsConfig";

export function useAdRotation(slot) {
  return useMemo(() => {
    const pool = ADS[slot];
    if (!pool || pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    // Remember the last ad shown for this slot (persists across sessions)
    const key = `ad_last_${slot}`;
    const last = parseInt(localStorage.getItem(key) ?? "-1", 10);

    // Pick randomly from all ads EXCEPT the last one shown
    const available = pool.map((_, i) => i).filter(i => i !== last);
    const next = available[Math.floor(Math.random() * available.length)];

    localStorage.setItem(key, String(next));
    return pool[next];
  }, [slot]);
}