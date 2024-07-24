const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

async function getCityName(lat, lon) {
  const response = await client.reverseGeocode({
    params: {
      latlng: [lat, lon],
      key: process.env.GOOGLE_API_KEY
    },
    timeout: 1000
  });

  const addressComponents = response.data.results[0].address_components;
  const cityComponent = addressComponents.find(component => component.types.includes('locality'));
  console.log("😍",cityComponent);
  
  return cityComponent ? cityComponent.long_name : null;
}

module.exports = getCityName;
