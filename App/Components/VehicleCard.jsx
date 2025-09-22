import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../Utils/Colors';

const { width } = Dimensions.get('window');

const VehicleCard = ({ vehicle, isSelected, onSelect, animatedValue }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isSelected) {
      // Glow animation when selected
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isSelected]);

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(vehicle);
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Glow effect for selected card */}
        {isSelected && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                shadowColor: vehicle.color,
              },
            ]}
          />
        )}
        
        <LinearGradient
          colors={isSelected ? vehicle.gradient : ['#ffffff', '#f8f9fa']}
          style={[styles.cardContent, isSelected && styles.selectedCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Selection indicator */}
          {isSelected && (
            <View style={styles.selectionBadge}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}

          {/* Vehicle Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: vehicle.imageUrl }} 
              style={styles.vehicleImage}
              resizeMode="cover"
            />
          </View>

          {/* Vehicle Info */}
          <View style={styles.infoContainer}>
            <Text style={[styles.vehicleName, isSelected && styles.selectedText]}>
              {vehicle.name}
            </Text>
            <Text style={[styles.vehicleBrand, isSelected && styles.selectedSubText]}>
              {vehicle.brand}
            </Text>
            <Text style={[styles.vehiclePrice, isSelected && styles.selectedSubText]}>
              {vehicle.price}
            </Text>
          </View>

          {/* Specs Row */}
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Text style={[styles.specValue, isSelected && styles.selectedText]}>
                {vehicle.range}km
              </Text>
              <Text style={[styles.specLabel, isSelected && styles.selectedSubText]}>
                Range
              </Text>
            </View>
            
            <View style={styles.specDivider} />
            
            <View style={styles.specItem}>
              <Text style={[styles.specValue, isSelected && styles.selectedText]}>
                {vehicle.batteryCapacity}kWh
              </Text>
              <Text style={[styles.specLabel, isSelected && styles.selectedSubText]}>
                Battery
              </Text>
            </View>
            
            <View style={styles.specDivider} />
            
            <View style={styles.specItem}>
              <Text style={[styles.specValue, isSelected && styles.selectedText]}>
                {vehicle.chargingTime}min
              </Text>
              <Text style={[styles.specLabel, isSelected && styles.selectedSubText]}>
                Charge Time
              </Text>
            </View>
          </View>

          {/* Connector Types */}
          <View style={styles.connectorsContainer}>
            {vehicle.connectorTypes.map((connector, index) => (
              <View key={index} style={[styles.connectorBadge, isSelected && styles.selectedConnectorBadge]}>
                <Text style={[styles.connectorText, isSelected && styles.selectedText]}>
                  {connector}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    elevation: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  cardContent: {
    padding: 20,
    borderRadius: 20,
    minHeight: 280,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectionBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  vehicleImage: {
    width: width * 0.7,
    height: 120,
    borderRadius: 12,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
    marginBottom: 4,
  },
  vehicleBrand: {
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 4,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  selectedText: {
    color: '#fff',
  },
  selectedSubText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 2,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.GRAY,
  },
  specDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.LIGHT_GRAY,
    marginHorizontal: 10,
  },
  connectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  connectorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 16,
  },
  selectedConnectorBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.BLACK,
  },
});

export default VehicleCard;