import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import React, { useContext } from "react";
import { UserLocationContext } from "../../Context/UserLocationContext";
import Markers from "./Markers";

export default function AppMapView({ placeList }) {
  const { location, setLocation } = useContext(UserLocationContext);

  // Static map rendering - console logs removed for cleaner output

  return (
    <View style={styles.container}>
      {/* Google Maps Style Background */}
      <View style={styles.mapBase}>
        
        {/* Major Roads Network */}
        <View style={styles.roadsContainer}>
          {/* Main Highway (Ring Road) */}
          <View style={styles.mainHighway} />
          <View style={styles.mainHighway2} />
          
          {/* Major Roads */}
          <View style={styles.majorRoad1} />
          <View style={styles.majorRoad2} />
          <View style={styles.majorRoad3} />
          <View style={styles.majorRoad4} />
          
          {/* Street Network */}
          <View style={styles.street1} />
          <View style={styles.street2} />
          <View style={styles.street3} />
          <View style={styles.street4} />
          <View style={styles.street5} />
        </View>
        
        {/* Parks and Green Areas */}
        <View style={styles.park1} />
        <View style={styles.park2} />
        
        {/* Water Bodies */}
        <View style={styles.yamuna} />
        
        {/* Metro Lines */}
        <View style={styles.metroLine} />
        
        {/* Your Location */}
        {location && (
          <View style={styles.userLocation}>
            <View style={styles.userLocationDot} />
            <View style={styles.userLocationRing} />
          </View>
        )}
        
        {/* EV Charging Stations */}
        <View style={styles.chargingStationsLayer}>
          {placeList && placeList.slice(0, 8).map((place, index) => (
            <View
              key={index}
              style={[
                styles.evStation,
                {
                  top: `${15 + (index * 10)}%`,
                  left: `${20 + ((index * 7) % 60)}%`,
                }
              ]}
            >
              <Text style={styles.evStationIcon}>⚡</Text>
            </View>
          ))}
        </View>
        
        {/* Landmarks */}
        <View style={styles.landmark1}>
          <Text style={styles.landmarkText}>🏛️</Text>
        </View>
        <View style={styles.landmark2}>
          <Text style={styles.landmarkText}>🏢</Text>
        </View>
        <View style={styles.landmark3}>
          <Text style={styles.landmarkText}>🏬</Text>
        </View>
      </View>
      
      {/* Map Info Overlay */}
      <View style={styles.mapInfo}>
        <Text style={styles.cityName}>Delhi, India</Text>
        <Text style={styles.stationCount}>{placeList?.length || 0} EV Charging Stations</Text>
      </View>
      
      {/* Zoom Controls (Visual Only) */}
      <View style={styles.zoomControls}>
        <View style={styles.zoomButton}>
          <Text style={styles.zoomText}>+</Text>
        </View>
        <View style={styles.zoomButton}>
          <Text style={styles.zoomText}>−</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  mapBase: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Google Maps beige color
    position: 'relative',
  },
  roadsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Major Highways
  mainHighway: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 6,
    backgroundColor: '#ffb74d', // Orange highway color
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mainHighway2: {
    position: 'absolute',
    top: '20%',
    left: '40%',
    width: 6,
    height: '60%',
    backgroundColor: '#ffb74d',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Major Roads
  majorRoad1: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    right: '15%',
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  majorRoad2: {
    position: 'absolute',
    top: '50%',
    left: '25%',
    right: '20%',
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  majorRoad3: {
    position: 'absolute',
    top: '10%',
    left: '25%',
    width: 4,
    height: '40%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  majorRoad4: {
    position: 'absolute',
    top: '25%',
    left: '60%',
    width: 4,
    height: '50%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  // Street Network
  street1: {
    position: 'absolute',
    top: '35%',
    left: '30%',
    width: '25%',
    height: 2,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  street2: {
    position: 'absolute',
    top: '45%',
    left: '35%',
    width: '20%',
    height: 2,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  street3: {
    position: 'absolute',
    top: '25%',
    left: '45%',
    width: 2,
    height: '25%',
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  street4: {
    position: 'absolute',
    top: '55%',
    left: '40%',
    width: '15%',
    height: 2,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  street5: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    width: 2,
    height: '20%',
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  // Parks (Green Areas)
  park1: {
    position: 'absolute',
    top: '20%',
    left: '70%',
    width: '18%',
    height: '15%',
    backgroundColor: '#c8e6c9',
    borderRadius: 8,
  },
  park2: {
    position: 'absolute',
    top: '60%',
    left: '15%',
    width: '20%',
    height: '12%',
    backgroundColor: '#c8e6c9',
    borderRadius: 8,
  },
  // Water Body (Yamuna River)
  yamuna: {
    position: 'absolute',
    top: '10%',
    right: '5%',
    width: '8%',
    height: '80%',
    backgroundColor: '#81d4fa',
    borderRadius: 25,
    opacity: 0.8,
  },
  // Metro Line
  metroLine: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    right: '25%',
    height: 3,
    backgroundColor: '#9c27b0',
    borderRadius: 1.5,
  },
  // User Location
  userLocation: {
    position: 'absolute',
    top: '42%',
    left: '47%',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196f3',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  // EV Charging Stations
  chargingStationsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  evStation: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  evStationIcon: {
    fontSize: 12,
    color: '#ffffff',
  },
  // Landmarks
  landmark1: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landmark2: {
    position: 'absolute',
    top: '35%',
    left: '65%',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landmark3: {
    position: 'absolute',
    top: '55%',
    left: '55%',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landmarkText: {
    fontSize: 16,
  },
  // Map Info
  mapInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  stationCount: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  // Zoom Controls
  zoomControls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    flexDirection: 'column',
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
  },
});
