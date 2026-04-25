import { createContext, useContext, useEffect, useState } from "react";

const AdsContext = createContext({ adsEnabled: true, setAdsEnabled: () => {} });

export function AdsProvider({ children }) {
  const [adsEnabled, setAdsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("sf_ads_enabled");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem("sf_ads_enabled", String(adsEnabled));
  }, [adsEnabled]);

  return (
    <AdsContext.Provider value={{ adsEnabled, setAdsEnabled }}>
      {children}
    </AdsContext.Provider>
  );
}

export const useAds = () => useContext(AdsContext);