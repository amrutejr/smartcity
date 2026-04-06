// src/api/factApi.js
import { setFact } from "../state.js";

export const loadFact = async () => {
  try {
    const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
    if (!res.ok) {
      throw new Error(`Fact API returned ${res.status}`);
    }
    const data = await res.json();
    setFact(data);
    return data;
  } catch (e) {
    console.error("Fact fetch error:", e);
    const fallback = {
      text: "Unable to load fact right now. Please check your internet connection and try again.",
    };
    setFact(fallback);
    return fallback;
  }
};
