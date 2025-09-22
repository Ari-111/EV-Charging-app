import { View, StyleSheet, Image } from "react-native";
import React, { useContext } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "./../../Utils/MapViewStyle.json";
import { UserLocationContext } from "../../Context/UserLocationContext";

export default function AppMapView({ placeList, selectedMarker, setSelectedMarker }) {
  const { location } = useContext(UserLocationContext);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        region={{
          longitude: location?.longitude || 0,
          latitude: location?.latitude || 0,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        }}
      >
        {/* User location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Image
              source={require("./../../../assets/images/cars-marker.png")}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
        )}

        {/* Place markers */}
        {placeList &&
          placeList.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              pinColor={
                selectedMarker &&
                selectedMarker.lat === place.geometry.location.lat &&
                selectedMarker.lng === place.geometry.location.lng
                  ? "blue"
                  : "red"
              }
              title={place.name}
              description={place.vicinity || place.formatted_address}
              onPress={() => setSelectedMarker(place.geometry.location)}
            >
              {place.photoUrl && (
                <Image
                  source={{ uri: place.photoUrl }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              )}
            </Marker>
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});
