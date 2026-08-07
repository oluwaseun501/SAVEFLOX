import { useMemo } from "react";
import { ENTRY_ADS } from "../config/entryAdsConfig";

function getRandomIndex(length) {
  if (length <= 1) return 0;

  try {
    const randomNumber = new Uint32Array(1);
    window.crypto.getRandomValues(randomNumber);

    return randomNumber[0] % length;
  } catch {
    return Math.floor(Math.random() * length);
  }
}

export function useEntryAdRotation() {
  return useMemo(() => {
    if (!Array.isArray(ENTRY_ADS) || ENTRY_ADS.length === 0) {
      return null;
    }

    const randomIndex = getRandomIndex(ENTRY_ADS.length);

    return ENTRY_ADS[randomIndex];
  }, []);
}