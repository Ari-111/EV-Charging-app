import { View, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import AppMapView from "./AppMapView";
import Header from "./Header";
import SearchBar from "./SearchBar";
import GlobalApi from "../../Utils/GlobalApi";
import { UserLocationContext } from "../../Context/UserLocationContext";
import PlaceListView from "./PlaceListView";
import { SelectedMarkerContext } from "../../Context/SelectedMarkerContext";

export default function HomeScreen() {
  const { location, setLocation } = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);

  console.log('HomeScreen - Location context value:', location);
  console.log('HomeScreen - Location type:', typeof location);

  useEffect(() => {
    location && GetNearByPlace();
  }, [location]);

  const GetNearByPlace = () => {
    GlobalApi.newNearbyPlace(location)
      .then((response) => {
        console.log(JSON.stringify(response.data.results));
        setPlaceList(response.data?.results);
      })
      .catch((error) => {
        console.error("Error fetching nearby places:", error);
      });
  };

  return (
    <SelectedMarkerContext.Provider
      value={{ selectedMarker, setSelectedMarker }}
    >
      <SafeAreaView style={styles.container}>
        {/* Map Background - Always Show */}
        <View style={styles.mapContainer}>
          <AppMapView placeList={placeList} />
        </View>

        {/* Header Overlay */}
        <View style={styles.headerContainer}>
          <Header />
          <SearchBar
            searchedLocation={(location) =>
              setLocation({
                latitude: location.lat,
                longitude: location.lng,
              })
            }
          />
        </View>

        {/* Place List Bottom Overlay */}
        <View style={styles.placeListContainer}>
          {placeList && <PlaceListView placeList={placeList} />}
        </View>
      </SafeAreaView>
    </SelectedMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    padding: 10,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50, // Add top padding for status bar
  },
  placeListContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
  },
});
