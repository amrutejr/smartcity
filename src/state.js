// src/state.js
// Simple singleton store to hold live data for cards and chatbot
export const store = {
  weather: null,
  rates: null,
  citizen: null,
  fact: null,
};

export const setWeather = (data) => {
  store.weather = data;
};
export const setRates = (data) => {
  store.rates = data;
};
export const setCitizen = (data) => {
  store.citizen = data;
};
export const setFact = (data) => {
  store.fact = data;
};
