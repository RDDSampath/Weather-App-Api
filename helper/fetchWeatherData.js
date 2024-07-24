const axios = require('axios');

async function fetchWeatherData(lat, lon) {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
  return response.data;
}

module.exports = fetchWeatherData;