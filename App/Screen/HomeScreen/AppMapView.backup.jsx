import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "./../../Utils/MapViewStyle.json";
import { UserLocationContext } from "../../Context/UserLocationContext";
import Markers from "./Markers";

export default function AppMapView({ placeList }) {
  const { location, setLocation } = useContext(UserLocationContext);

  console.log('AppMapView - Location full object:', JSON.stringify(location, null, 2));
  console.log('AppMapView - Location type:', typeof location);
  console.log('AppMapView - Location keys:', location ? Object.keys(location) : 'no location');
  console.log('AppMapView - PlaceList length:', placeList?.length || 0);

  // Use location if available, otherwise use default location (San Francisco) for testing
  const mapRegion = {
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  };

  console.log('AppMapView - Using map region:', mapRegion);

  return (
    <View style={styles.container}>
      {/* Test background to verify container is rendering */}
      <View style={[styles.mapTestBackground]}>
        <Text style={styles.mapTestText}>Map Area - Should see this behind the map</Text>
      </View>
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={[]}
        region={mapRegion}
        initialRegion={mapRegion}
        showsUserLocation={location ? true : false}
        showsMyLocationButton={false}
        onMapReady={() => {
          console.log('✅ Google Maps loaded successfully!');
        }}
        onError={(error) => {
          console.error('❌ Google Maps error:', error);
        }}
        onLayout={(event) => {
          console.log('📐 Map layout dimensions:', event.nativeEvent.layout);
        }}
        loadingEnabled={true}
        loadingIndicatorColor="#007AFF"
        loadingBackgroundColor="#f0f0f0"
      >
        <Marker
          coordinate={{
            latitude: location?.latitude || 37.7749,
            longitude: location?.longitude || -122.4194,
          }}
        >
          <Image
            source={require("./../../../assets/images/cars-marker.png")}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </Marker>
        <Markers placeList={placeList} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  mapTestBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  mapTestText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});