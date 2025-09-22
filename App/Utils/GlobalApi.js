import axios from "axios";
import { STATION_EXTRAS, generateRandomExtras } from "./StationExtras";

const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

const API_KEY = "AIzaSyD4hG4XEqrcNMQvc4YXoLyPRf5c-mo-m8k";

const config = {
    params: {
      key: API_KEY,
      type: 'gas_station', // Specify the place type
      rankby: 'distance', // Sort results by distance
    },
  };
  
  const newNearbyPlace = async (location) => {
    try {
      const response = await axios.get(BASE_URL, {
        ...config,
        params: {
          ...config.params,
          location: `${location.latitude},${location.longitude}`,
        },
      });

      // Enrich the response with pricing and wait time data
      const enrichedResults = response.data.results.map(station => {
        // Check if we have static data for this station
        const staticExtras = STATION_EXTRAS[station.place_id];
        
        // If no static data, generate random data for demo purposes
        const extras = staticExtras || generateRandomExtras();
        
        return {
          ...station,
          price: extras.price,
          waitTime: extras.wait,
          availability: extras.availability,
          chargingSpeed: extras.chargingSpeed,
          connectorTypes: extras.connectorTypes,
          amenities: extras.amenities,
        };
      });

      return {
        ...response,
        data: {
          ...response.data,
          results: enrichedResults
        }
      };
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      throw error;
    }
  };
  
  export default {
    newNearbyPlace,
    API_KEY
  };