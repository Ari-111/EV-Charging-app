import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Linking } from "react-native";
import {
  Card,
  Text,
  Button,
  Switch,
  useTheme,
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from "react-native-paper";
import AppMapView from "./AppMapView";
import Header from "./Header";
import SearchBar from "./SearchBar";
import GlobalApi from "../../Utils/GlobalApi";
import { UserLocationContext } from "../../Context/UserLocationContext";
import { SelectedMarkerContext } from "../../Context/SelectedMarkerContext";

const GOOGLE_API_KEY = "AIzaSyD4hG4XEqrcNMQvc4YXoLyPRf5c-mo-m8k";
const getPhotoUrl = (photoReference) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;

export default function HomeScreen() {
  const { location, setLocation } = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (location) fetchNearbyPlaces();
  }, [location]);

  const fetchNearbyPlaces = async () => {
    try {
      const response = await GlobalApi.newNearbyPlace(location);
      const resultsWithPhotos = response.data?.results.map((place) => ({
        ...place,
        photoUrl: place.photos?.[0]?.photo_reference
          ? getPhotoUrl(place.photos[0].photo_reference)
          : "https://via.placeholder.com/400x250?text=No+Image",
      }));
      setPlaceList(resultsWithPhotos);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    }
  };

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const handleSelectPlace = (place) => {
    setSelectedMarker(place.geometry.location);

    // Open Google Maps with directions + traffic
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${place.geometry.location.lat},${place.geometry.location.lng}&dirflg=d`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}&travelmode=driving`,
    });
    Linking.openURL(url);
  };

  return (
    <PaperProvider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <SelectedMarkerContext.Provider
        value={{ selectedMarker, setSelectedMarker }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* Header + Search + Theme Toggle */}
          <View style={styles.headerContainer}>
            <Header />
            <SearchBar
              searchedLocation={(loc) =>
                setLocation({ latitude: loc.lat, longitude: loc.lng })
              }
            />
            <View style={styles.themeToggle}>
              <Text>Dark Theme</Text>
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            </View>
          </View>

          {/* Map with Markers */}
          {placeList.length > 0 && (
            <AppMapView
              placeList={placeList}
              selectedMarker={selectedMarker}
            />
          )}

          {/* Nearby Places */}
          <View
            style={[
              styles.placeListContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Nearby Places
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {placeList.map((place) => (
                <Card key={place.place_id} style={styles.card}>
                  <Card.Cover source={{ uri: place.photoUrl }} />
                  <Card.Content>
                    <Text variant="titleMedium" numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text variant="bodySmall" numberOfLines={2}>
                      {place.vicinity || place.formatted_address}
                    </Text>

                    {/* Extra info like old UI */}
                    <Text style={{ fontWeight: "600", marginTop: 4 }}>
                      Rating: {place.rating || "N/A"}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      Availability: {place.availability || "Unknown"}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      Price: {place.price || "₹—"}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      Wait Time: {place.waitTime || "0 min"}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      Charging Speed: {place.chargingSpeed || "Unknown"}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      Connectors: {place.connectorTypes?.join(", ") || "Unknown"}
                    </Text>
                  </Card.Content>

                  <Card.Actions>
                    <Button onPress={() => handleSelectPlace(place)}>
                      Select
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </ScrollView>
          </View>
        </View>
      </SelectedMarkerContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    position: "absolute",
    zIndex: 10,
    padding: 10,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeToggle: { flexDirection: "row", alignItems: "center" },
  placeListContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 8,
  },
  card: { width: 250, marginHorizontal: 10, borderRadius: 15, elevation: 3 },
});
