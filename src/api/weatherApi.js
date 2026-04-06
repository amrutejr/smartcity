// src/api/weatherApi.js
import { setWeather } from "../state.js";

export const loadWeather = async () => {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&current_weather=true"
    );
    if (!res.ok) {
      throw new Error(`Weather API returned ${res.status}`);
    }
    const data = await res.json();
    const weather = data.current_weather ?? {
      temperature: "N/A",
      windspeed: "N/A",
      weathercode: "N/A",
    };
    setWeather(weather);
    return weather;
  } catch (e) {
    console.error("Weather fetch error:", e);
    const fallback = {
      temperature: "N/A",
      windspeed: "N/A",
      weathercode: "N/A",
    };
    setWeather(fallback);
    return fallback;
  }
};
