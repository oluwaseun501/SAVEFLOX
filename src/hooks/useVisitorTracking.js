import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useVisitorTracking() {
  useEffect(() => {
    // Only track once per browser session
    if (sessionStorage.getItem("sf_tracked")) return;

    async function track() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data && data.country_name) {
          await supabase.from("visitor_logs").insert({
            country: data.country_name,
            country_code: data.country_code,
            city: data.city,
            region: data.region,
          });
          sessionStorage.setItem("sf_tracked", "true");
        }
      } catch (err) {
        // silent fail — never break the site
      }
    }

    track();
  }, []);
}