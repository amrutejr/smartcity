// src/api/citizenApi.js
import { setCitizen } from "../state.js";

export const loadCitizen = async () => {
  try {
    const res = await fetch("https://randomuser.me/api/");
    if (!res.ok) {
      throw new Error(`Citizen API returned ${res.status}`);
    }
    const data = await res.json();
    const person = data.results?.[0];
    if (!person) {
      throw new Error("Citizen API returned empty results");
    }
    setCitizen(person);
    return person;
  } catch (e) {
    console.error("Citizen fetch error:", e);
    const fallback = {
      name: { first: "Unknown", last: "Citizen" },
      location: { city: "Unavailable", country: "Unavailable" },
      picture: { large: "" },
    };
    setCitizen(fallback);
    return fallback;
  }
};
