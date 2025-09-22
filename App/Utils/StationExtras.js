// Static data for EV charging station comprehensive information
// Key: place_id from Google Places API response
export const STATION_EXTRAS = {
  // Add known stations here - these will be populated as you discover real place_ids
  "ChIJ3dAFHG_7DDkR3uGgvUTpl1E": { 
    price: "₹15/kWh", 
    wait: "20 min", 
    availability: "Available",
    chargingSpeed: "Fast",
    connectorTypes: ["Type 2", "CCS"],
    amenities: ["WiFi", "Cafe", "Restrooms"]
  },
  "ChIJPTMLHm_7DDkRtQ9d9gT3HXE": { 
    price: "₹12/kWh", 
    wait: "5 min", 
    availability: "Busy",
    chargingSpeed: "Slow",
    connectorTypes: ["Type 2"],
    amenities: ["WiFi", "Parking"]
  },
  "ChIJVbcWCmb7DDkRgwFPr6EbCmo": { 
    price: "₹18/kWh", 
    wait: "0 min", 
    availability: "Available",
    chargingSpeed: "Rapid",
    connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
    amenities: ["WiFi", "Cafe", "Restrooms", "Shopping"]
  },
  "ChIJedUrQ3_7DDkRrrPdxbAyyNs": { 
    price: "₹14/kWh", 
    wait: "15 min", 
    availability: "Available",
    chargingSpeed: "Fast",
    connectorTypes: ["Type 2", "CCS"],
    amenities: ["WiFi", "ATM"]
  },
  "ChIJcVVPMOBSDDkRWRx8be8wW6c": { 
    price: "₹16/kWh", 
    wait: "10 min", 
    availability: "Available",
    chargingSpeed: "Fast",
    connectorTypes: ["Type 2", "CCS"],
    amenities: ["WiFi", "Cafe", "Restrooms", "Parking"]
  },
  // Add more stations as needed
};

// Generate random comprehensive data for demo purposes
export const generateRandomExtras = () => {
  const prices = ["₹12/kWh", "₹14/kWh", "₹15/kWh", "₹16/kWh", "₹18/kWh", "₹20/kWh"];
  const waitTimes = ["0 min", "5 min", "10 min", "15 min", "20 min", "25 min"];
  const availability = ["Available", "Busy", "Occupied", "Available"];
  const chargingSpeeds = ["Slow", "Fast", "Rapid"];
  const allConnectors = ["Type 2", "CCS", "CHAdeMO", "Tesla Supercharger"];
  const allAmenities = ["WiFi", "Cafe", "Restrooms", "Parking", "ATM", "Shopping", "Food Court", "Waiting Area"];

  // Generate random connector types (1-3 types)
  const numConnectors = Math.floor(Math.random() * 3) + 1;
  const connectorTypes = [];
  const shuffledConnectors = [...allConnectors].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numConnectors; i++) {
    connectorTypes.push(shuffledConnectors[i]);
  }

  // Generate random amenities (1-4 amenities)
  const numAmenities = Math.floor(Math.random() * 4) + 1;
  const amenities = [];
  const shuffledAmenities = [...allAmenities].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numAmenities; i++) {
    amenities.push(shuffledAmenities[i]);
  }
  
  return {
    price: prices[Math.floor(Math.random() * prices.length)],
    wait: waitTimes[Math.floor(Math.random() * waitTimes.length)],
    availability: availability[Math.floor(Math.random() * availability.length)],
    chargingSpeed: chargingSpeeds[Math.floor(Math.random() * chargingSpeeds.length)],
    connectorTypes: connectorTypes,
    amenities: amenities
  };
};