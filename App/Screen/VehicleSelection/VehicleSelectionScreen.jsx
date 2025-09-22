import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/clerk-expo';
import VehicleCard from '../../Components/VehicleCard';
import { EV_MODELS } from '../../Utils/VehicleData';
import { VehicleService } from '../../Utils/VehicleFirebaseService';
import Colors from '../../Utils/Colors';

const VehicleSelectionScreen = ({ navigation }) => {
  const { user } = useUser();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [vehicleNickname, setVehicleNickname] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('100');

  const vehicleList = Object.values(EV_MODELS);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleNickname(vehicle.name); // Default nickname
  };

  const handleAddVehicle = () => {
    if (!selectedVehicle) {
      Alert.alert('No Vehicle Selected', 'Please select a vehicle to continue.');
      return;
    }
    setShowNicknameModal(true);
  };

  const confirmAddVehicle = async () => {
    if (!vehicleNickname.trim()) {
      Alert.alert('Invalid Nickname', 'Please enter a valid nickname for your vehicle.');
      return;
    }

    if (!batteryLevel || isNaN(batteryLevel) || batteryLevel < 0 || batteryLevel > 100) {
      Alert.alert('Invalid Battery Level', 'Please enter a valid battery level (0-100).');
      return;
    }

    setLoading(true);
    try {
      await VehicleService.addUserVehicle(user.id, {
        ...selectedVehicle,
        nickname: vehicleNickname.trim(),
        currentBattery: parseInt(batteryLevel),
        purchaseDate: new Date()
      });

      Alert.alert(
        'Vehicle Added Successfully!',
        `${vehicleNickname} has been added to your profile.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
      setShowNicknameModal(false);
    }
  };

  const renderVehicleCard = ({ item, index }) => (
    <VehicleCard
      vehicle={item}
      isSelected={selectedVehicle?.id === item.id}
      onSelect={handleVehicleSelect}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.SECONDARY]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Choose Your Electric Vehicle</Text>
        <Text style={styles.headerSubtitle}>
          Select your EV model to get personalized charging recommendations
        </Text>
      </LinearGradient>

      <FlatList
        data={vehicleList}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {selectedVehicle && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddVehicle}
            disabled={loading}
          >
            <LinearGradient
              colors={selectedVehicle.gradient}
              style={styles.addButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>
                  Add {selectedVehicle.name} to My Garage
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Nickname and Battery Modal */}
      <Modal
        visible={showNicknameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNicknameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Vehicle Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Vehicle Nickname</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleNickname}
                onChangeText={setVehicleNickname}
                placeholder="Enter a nickname for your vehicle"
                placeholderTextColor={Colors.GRAY}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Battery Level (%)</Text>
              <TextInput
                style={styles.textInput}
                value={batteryLevel}
                onChangeText={setBatteryLevel}
                placeholder="100"
                placeholderTextColor={Colors.GRAY}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNicknameModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmAddVehicle}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Add Vehicle</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    paddingVertical: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
  },
  addButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 25,
    minWidth: 300,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.BLACK,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.LIGHT_GRAY,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VehicleSelectionScreen;