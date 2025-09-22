import axios from "axios";

const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

const API_KEY = "AIzaSyD4hG4XEqrcNMQvc4YXoLyPRf5c-mo-m8k";

const config = {
    params: {
      key: API_KEY,
      type: 'gas_station', // Specify the place type
      rankby: 'distance', // Sort results by distance
    },
  };
  
  const newNearbyPlace = (location) => axios.get(BASE_URL, {
    ...config,
    params: {
      ...config.params,
      location: `${location.latitude},${location.longitude}`,
    },
  });
  
  export default {
    newNearbyPlace,
    API_KEY
  };