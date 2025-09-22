import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function SearchBar({ searchedLocation }) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search EV Station"
      fetchDetails={true}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        if (details?.geometry?.location) {
          // Pass correct lat/lng to parent
          searchedLocation({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      query={{
        key: "YOUR_GOOGLE_MAPS_API_KEY",
        language: "en",
      }}
      styles={{
        container: { flex: 0, width: 200 },
        textInput: { height: 40, fontSize: 16 },
      }}
    />
  );
}
