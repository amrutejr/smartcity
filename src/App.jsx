import React, { useEffect, useState } from "react";
import { loadWeather } from "./api/weatherApi";
import { loadRates } from "./api/ratesApi";
import { loadCitizen } from "./api/citizenApi";
import { loadFact } from "./api/factApi";
import { DataCard } from "./components/DataCard";
import ChatBot from "./components/ChatBot";



function App() {
  // Loading states for each card
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [citizenLoading, setCitizenLoading] = useState(false);
  const [factLoading, setFactLoading] = useState(false);

  // Data state (derived from global store)
  const [weather, setWeather] = useState(null);
  const [rates, setRates] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [fact, setFact] = useState(null);

  // Initial load on mount
  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await Promise.all([
      refreshWeather(),
      refreshRates(),
      refreshCitizen(),
      refreshFact(),
    ]);
  };

  const refreshWeather = async () => {
    setWeatherLoading(true);
    try {
      const data = await loadWeather();
      setWeather(data);
    } finally {
      setWeatherLoading(false);
    }
  };

  const refreshRates = async () => {
    setRatesLoading(true);
    try {
      const data = await loadRates();
      setRates(data);
    } finally {
      setRatesLoading(false);
    }
  };

  const refreshCitizen = async () => {
    setCitizenLoading(true);
    try {
      const data = await loadCitizen();
      setCitizen(data);
    } finally {
      setCitizenLoading(false);
    }
  };

  const refreshFact = async () => {
    setFactLoading(true);
    try {
      const data = await loadFact();
      setFact(data);
    } finally {
      setFactLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>SmartCity Dashboard</h1>
        <p>Real-time citizen information portal</p>
      </div>

      <div className="dashboard-grid">
        <DataCard title="Current Weather" loading={weatherLoading} onRefresh={refreshWeather}>
          {weather ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                {weather.temperature}°C
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <span>Wind: {weather.windspeed} m/s</span>
                <span>Code: {weather.weathercode}</span>
              </div>
            </div>
          ) : (
            <p>Gathering weather data...</p>
          )}
        </DataCard>

        <DataCard title="Currency Rates (INR)" loading={ratesLoading} onRefresh={refreshRates}>
          {rates ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <span>🇺🇸 USD</span>
                <strong style={{ color: "white" }}>{rates.rates.USD?.toFixed(2) ?? "N/A"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <span>🇪🇺 EUR</span>
                <strong style={{ color: "white" }}>{rates.rates.EUR?.toFixed(2) ?? "N/A"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <span>🇬🇧 GBP</span>
                <strong style={{ color: "white" }}>{rates.rates.GBP?.toFixed(2) ?? "N/A"}</strong>
              </div>
            </div>
          ) : (
            <p>Fetching latest rates...</p>
          )}
        </DataCard>

        <DataCard title="Featured Citizen" loading={citizenLoading} onRefresh={refreshCitizen}>
          {citizen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem" }}>
              {citizen.picture?.large ? (
                <img 
                  src={citizen.picture.large} 
                  alt="citizen" 
                  style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid var(--accent)", padding: "2px" }} 
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    background: "rgba(255,255,255,0.08)",
                    fontWeight: 600,
                  }}
                >
                  N/A
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <strong style={{ fontSize: "1.1rem", color: "white" }}>{citizen.name?.first ?? "Unknown"} {citizen.name?.last ?? "Citizen"}</strong>
                <span>{citizen.location?.city ?? "Unavailable"}, {citizen.location?.country ?? "Unavailable"}</span>
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </DataCard>

        <DataCard title="City Fact of the Day" loading={factLoading} onRefresh={refreshFact}>
          {fact ? (
            <p style={{ fontStyle: "italic", fontSize: "1.05rem", lineHeight: "1.6" }}>
              "{fact.text}"
            </p>
          ) : (
            <p>Loading interesting fact...</p>
          )}
        </DataCard>
      </div>

      <ChatBot />
    </div>
  );
}

export default App;
