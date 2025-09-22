import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, Modal, TextInput, ActivityIndicator, FlatList, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../Utils/Colors'
import { useAuth, useUser } from '@clerk/clerk-expo'
import VehicleDashboard from '../../Components/VehicleDashboard'
import VehicleCard from '../../Components/VehicleCard'
import { VehicleService } from '../../Utils/VehicleFirebaseService'
import { EV_MODELS } from '../../Utils/VehicleData'

export default function ProfileScreen({ navigation }) {
  const { signOut } = useAuth()
  const { user } = useUser()
  const [userVehicles, setUserVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [batteryLevel, setBatteryLevel] = useState('')
  const [nickname, setNickname] = useState('')
  
  // Vehicle selection states
  const [showVehicleSelection, setShowVehicleSelection] = useState(false)
  const [selectedVehicleModel, setSelectedVehicleModel] = useState(null)
  const [vehicleNickname, setVehicleNickname] = useState('')
  const [newVehicleBattery, setNewVehicleBattery] = useState('100')
  const [addingVehicle, setAddingVehicle] = useState(false)

  useEffect(() => {
    loadUserVehicles()
  }, [user])

  const loadUserVehicles = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const vehicles = await VehicleService.getUserVehicles(user.id)
      console.log('Loaded vehicles:', vehicles)
      setUserVehicles(vehicles)
      
      // Auto-select first vehicle if available
      if (vehicles.length > 0 && !selectedVehicle) {
        setSelectedVehicle(vehicles[0])
      }
    } catch (error) {
      console.error('Error loading vehicles:', error)
      Alert.alert('Error', 'Failed to load your vehicles.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadUserVehicles()
    setRefreshing(false)
  }

  const handleAddVehicle = () => {
    setShowVehicleSelection(true)
  }

  const handleVehicleModelSelect = (vehicleModel) => {
    setSelectedVehicleModel(vehicleModel)
    setVehicleNickname('')
    setNewVehicleBattery('100')
  }

  const handleSaveNewVehicle = async () => {
    if (!selectedVehicleModel) return
    
    setAddingVehicle(true)
    try {
      const newVehicle = {
        id: selectedVehicleModel.id,
        name: selectedVehicleModel.name,
        brand: selectedVehicleModel.brand,
        year: 2024,
        nickname: vehicleNickname || `My ${selectedVehicleModel.name}`,
        currentBattery: parseInt(newVehicleBattery),
        chargingData: {
          lastChargeDate: new Date(),
          totalChargingSessions: 0,
          averageChargingTime: 0,
          preferredChargingLocations: []
        }
      }
      
      const vehicleId = await VehicleService.addUserVehicle(user.id, newVehicle)
      console.log('Added vehicle with ID:', vehicleId)
      await loadUserVehicles()
      
      // Close modal and reset states
      setShowVehicleSelection(false)
      setSelectedVehicleModel(null)
      setVehicleNickname('')
      setNewVehicleBattery('100')
    } catch (error) {
      console.error('Error adding vehicle:', error)
      Alert.alert('Error', 'Failed to add vehicle. Please try again.')
    } finally {
      setAddingVehicle(false)
    }
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle)
    setNickname(vehicle.nickname)
    setBatteryLevel(vehicle.currentBattery.toString())
    setShowEditModal(true)
  }

  const handleRemoveVehicle = (vehicle) => {
    Alert.alert(
      'Remove Vehicle',
      `Are you sure you want to remove "${vehicle.nickname}" from your garage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await VehicleService.removeVehicle(vehicle.id, user.id)
              await loadUserVehicles()
              
              // If the removed vehicle was selected, select another one
              if (selectedVehicle?.id === vehicle.id) {
                const remainingVehicles = userVehicles.filter(v => v.id !== vehicle.id)
                setSelectedVehicle(remainingVehicles[0] || null)
              }
              
              Alert.alert('Success', 'Vehicle removed successfully.')
            } catch (error) {
              console.error('Error removing vehicle:', error)
              Alert.alert('Error', 'Failed to remove vehicle.')
            }
          }
        }
      ]
    )
  }

  const saveVehicleEdit = async () => {
    if (!nickname.trim()) {
      Alert.alert('Invalid Nickname', 'Please enter a valid nickname.')
      return
    }

    if (!batteryLevel || isNaN(batteryLevel) || batteryLevel < 0 || batteryLevel > 100) {
      Alert.alert('Invalid Battery Level', 'Please enter a valid battery level (0-100).')
      return
    }

    try {
      await VehicleService.updateVehicleBattery(editingVehicle.id, parseInt(batteryLevel), user.id)
      
      // Update local state
      setUserVehicles(prev => prev.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, nickname: nickname.trim(), currentBattery: parseInt(batteryLevel) }
          : v
      ))
      
      if (selectedVehicle?.id === editingVehicle.id) {
        setSelectedVehicle(prev => ({
          ...prev,
          nickname: nickname.trim(),
          currentBattery: parseInt(batteryLevel)
        }))
      }
      
      setShowEditModal(false)
      Alert.alert('Success', 'Vehicle updated successfully.')
    } catch (error) {
      console.error('Error updating vehicle:', error)
      Alert.alert('Error', 'Failed to update vehicle.')
    }
  }

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.PRIMARY, Colors.SECONDARY]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Hello {user?.firstName || 'EV Owner'},</Text>
          <Text style={styles.userName}>Ready for your next charge?</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.garageHeader}>
        <Text style={styles.garageTitle}>My Electric Vehicles</Text>
        <Text style={styles.garageSubtitle}>
          {userVehicles.length} vehicle{userVehicles.length !== 1 ? 's' : ''} in your garage
        </Text>
      </View>
    </LinearGradient>
  )

  const renderVehicleSelector = () => {
    if (userVehicles.length === 0) return null

    return (
      <View style={styles.vehicleSelectorContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehicleSelector}
        >
          {userVehicles.map((vehicle) => {
            const vehicleModel = EV_MODELS[vehicle.vehicleId]
            if (!vehicleModel) {
              console.warn('Vehicle model not found for ID:', vehicle.vehicleId)
              return null
            }
            const isSelected = selectedVehicle?.id === vehicle.id
            
            return (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleSelectorItem,
                  isSelected && styles.selectedVehicleItem
                ]}
                onPress={() => setSelectedVehicle(vehicle)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? vehicleModel.gradient : ['#ffffff', '#f8f9fa']}
                  style={styles.vehicleItemGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                  {/* Vehicle Image */}
                  <View style={styles.vehicleImageContainer}>
                    <Image 
                      source={{uri: vehicleModel.imageUrl}} 
                      style={styles.vehicleImage}
                      defaultSource={require('../../../assets/images/ev-car-charging.png')}
                    />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      </View>
                    )}
                  </View>
                  
                  {/* Vehicle Info */}
                  <Text style={[
                    styles.vehicleItemName,
                    isSelected && styles.selectedVehicleText
                  ]} numberOfLines={1}>
                    {vehicle.nickname}
                  </Text>
                  
                  {/* Battery Status */}
                  <View style={styles.batteryStatusContainer}>
                    <Ionicons 
                      name="battery-charging" 
                      size={12} 
                      color={isSelected ? '#fff' : Colors.PRIMARY} 
                    />
                    <Text style={[
                      styles.vehicleItemBattery,
                      isSelected && styles.selectedVehicleText
                    ]}>
                      {vehicle.currentBattery}%
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )
          }).filter(Boolean)}
        </ScrollView>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name="car-sport-outline" size={100} color={Colors.PRIMARY} />
        </View>
        
        <Text style={styles.emptyTitle}>Welcome to Your EV Garage!</Text>
        <Text style={styles.emptySubtitle}>
          Start your electric journey by adding your first vehicle. Get personalized charging insights, smart reminders, and track your eco-friendly impact.
        </Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="battery-charging" size={24} color={Colors.PRIMARY} />
            <Text style={styles.benefitText}>Battery Monitoring</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="analytics" size={24} color={Colors.PRIMARY} />
            <Text style={styles.benefitText}>Charging Analytics</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="notifications" size={24} color={Colors.PRIMARY} />
            <Text style={styles.benefitText}>Smart Reminders</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.addFirstVehicleButton}
          onPress={handleAddVehicle}
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.SECONDARY]}
            style={styles.addFirstVehicleGradient}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addFirstVehicleText}>Add Your First Vehicle</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['#f8f9fa', '#ffffff']}
            style={styles.loadingGradient}
          >
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={styles.loadingText}>Loading your garage...</Text>
            <Text style={styles.loadingSubtext}>Fetching your electric vehicles</Text>
          </LinearGradient>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.PRIMARY]}
          />
        }
      >
        {userVehicles.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderVehicleSelector()}
            
            {selectedVehicle && (
              <VehicleDashboard
                userVehicle={selectedVehicle}
                onEdit={handleEditVehicle}
                onRemove={handleRemoveVehicle}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Add Vehicle FAB */}
      {userVehicles.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleAddVehicle}
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.SECONDARY]}
            style={styles.fabGradient}
          >
            <Ionicons name="car-sport" size={24} color="#fff" />
            <Ionicons name="add-circle" size={16} color="#fff" style={styles.fabAddIcon} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Edit Vehicle Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Vehicle</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Vehicle Nickname</Text>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Enter nickname"
                placeholderTextColor={Colors.GRAY}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Battery Level (%)</Text>
              <TextInput
                style={styles.textInput}
                value={batteryLevel}
                onChangeText={setBatteryLevel}
                placeholder="0-100"
                placeholderTextColor={Colors.GRAY}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveVehicleEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleSelection}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVehicleSelection(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <View style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: Colors.GRAY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.PRIMARY }}>
              Add New Vehicle
            </Text>
            <TouchableOpacity onPress={() => setShowVehicleSelection(false)}>
              <Text style={{ fontSize: 16, color: Colors.PRIMARY }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {!selectedVehicleModel ? (
              <View style={{ padding: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 15,
                  color: Colors.DARK_GRAY
                }}>
                  Choose your vehicle model:
                </Text>
                <FlatList
                  data={Object.values(EV_MODELS)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleVehicleModelSelect(item)}>
                      <VehicleCard
                        vehicle={item}
                        isSelected={false}
                        onSelect={() => handleVehicleModelSelect(item)}
                      />
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <View style={{ padding: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 15,
                  color: Colors.DARK_GRAY
                }}>
                  Vehicle Details
                </Text>

                <View style={{
                  backgroundColor: Colors.LIGHT_GRAY,
                  padding: 15,
                  borderRadius: 15,
                  marginBottom: 20
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                      source={{ uri: selectedVehicleModel.imageUrl }} 
                      style={{ width: 60, height: 40, marginRight: 15 }}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {selectedVehicleModel.make} {selectedVehicleModel.model}
                      </Text>
                      <Text style={{ color: Colors.DARK_GRAY }}>
                        Range: {selectedVehicleModel.range}km • {selectedVehicleModel.batteryCapacity}kWh
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 5 }}>
                    Vehicle Nickname (Optional)
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.GRAY,
                      padding: 15,
                      borderRadius: 10,
                      fontSize: 16
                    }}
                    value={vehicleNickname}
                    onChangeText={setVehicleNickname}
                    placeholder={`My ${selectedVehicleModel.model}`}
                  />
                </View>

                <View style={{ marginBottom: 30 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 5 }}>
                    Current Battery Level (%)
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.GRAY,
                      padding: 15,
                      borderRadius: 10,
                      fontSize: 16
                    }}
                    value={newVehicleBattery}
                    onChangeText={setNewVehicleBattery}
                    keyboardType="numeric"
                    placeholder="100"
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 15,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: Colors.PRIMARY,
                      alignItems: 'center'
                    }}
                    onPress={() => setSelectedVehicleModel(null)}
                  >
                    <Text style={{ color: Colors.PRIMARY, fontWeight: '500' }}>
                      Back
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: Colors.PRIMARY,
                      padding: 15,
                      borderRadius: 10,
                      alignItems: 'center',
                      opacity: addingVehicle ? 0.7 : 1
                    }}
                    onPress={handleSaveNewVehicle}
                    disabled={addingVehicle}
                  >
                    <Text style={{ color: Colors.WHITE, fontWeight: '500' }}>
                      {addingVehicle ? 'Adding...' : 'Add Vehicle'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  garageHeader: {
    paddingHorizontal: 20,
  },
  garageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  garageSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 16,
  },
  vehicleSelectorContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  vehicleSelector: {
    paddingHorizontal: 16,
    gap: 12,
  },
  vehicleSelectorItem: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  selectedVehicleItem: {
    elevation: 6,
    shadowOpacity: 0.25,
    transform: [{scale: 1.02}],
  },
  vehicleItemGradient: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minWidth: 140,
    alignItems: 'center',
    borderRadius: 16,
  },
  vehicleImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  vehicleImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
    marginBottom: 4,
    textAlign: 'center',
  },
  batteryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleItemBattery: {
    fontSize: 12,
    color: Colors.GRAY,
    fontWeight: '500',
  },
  selectedVehicleText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 500,
  },
  emptyIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(11, 194, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  benefitItem: {
    alignItems: 'center',
    flex: 1,
  },
  benefitText: {
    fontSize: 12,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  addFirstVehicleButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addFirstVehicleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  addFirstVehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fabAddIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.BLACK,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 4,
    textAlign: 'center',
  },
})
