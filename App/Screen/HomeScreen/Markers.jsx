import React, { useContext } from "react";
import { Marker, Image } from "react-native-maps";
import { SelectedMarkerContext } from "../../Context/SelectedMarkerContext";

export default function Markers({ index, place }) {
  if (!place || !place.location) return null;

  const { latitude, longitude } = place.location;
  if (isNaN(latitude) || isNaN(longitude)) return null;

  const { selectedMarker, setSelectedMarker } = useContext(
    SelectedMarkerContext
  );

  const isSelected =
    selectedMarker?.latitude === latitude &&
    selectedMarker?.longitude === longitude;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => setSelectedMarker({ latitude, longitude })}
    >
      <Image
        source={require("./../../../assets/images/marker.png")}
        style={{
          width: isSelected ? 80 : 70,
          height: isSelected ? 80 : 70,
          // optional: add shadow or tint if selected
          tintColor: isSelected ? "#FF0000" : undefined,
        }}
      />
    </Marker>
  );
}
