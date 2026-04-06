// src/api/ratesApi.js
import { setRates } from "../state.js";

export const loadRates = async () => {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
    if (!res.ok) {
      throw new Error(`Rates API returned ${res.status}`);
    }
    const data = await res.json();
    setRates(data);
    return data;
  } catch (e) {
    console.error("Rates fetch error:", e);
    const fallback = {
      rates: {
        USD: null,
        EUR: null,
        GBP: null,
      },
    };
    setRates(fallback);
    return fallback;
  }
};
