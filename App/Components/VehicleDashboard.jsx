import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { EV_MODELS, generateSampleChargingHistory, generateSmartReminders } from '../Utils/VehicleData';
import { VehicleService, ChargingService } from '../Utils/VehicleFirebaseService';
import Colors from '../Utils/Colors';

const { width } = Dimensions.get('window');

const VehicleDashboard = ({ userVehicle, onEdit, onRemove }) => {
  const [chargingHistory, setChargingHistory] = useState([]);
  const [chargingStats, setChargingStats] = useState(null);
  const [smartReminders, setSmartReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const vehicleModel = EV_MODELS[userVehicle.vehicleId];

  useEffect(() => {
    loadVehicleData();
  }, [userVehicle]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      
      // Load charging history and stats
      const history = await ChargingService.getChargingHistory(userVehicle.id);
      const stats = await ChargingService.getChargingStats(userVehicle.id);
      
      // If no real data, generate sample data
      if (history.length === 0) {
        const sampleHistory = generateSampleChargingHistory(userVehicle.vehicleId);
        setChargingHistory(sampleHistory);
      } else {
        setChargingHistory(history);
      }
      
      setChargingStats(stats);
      
      // Generate smart reminders
      const reminders = generateSmartReminders(vehicleModel, history);
      setSmartReminders(reminders);
      
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      Alert.alert('Error', 'Failed to load vehicle data.');
    } finally {
      setLoading(false);
    }
  };

  const getBatteryColor = (level) => {
    if (level >= 80) return ['#4CAF50', '#8BC34A'];
    if (level >= 50) return ['#FF9800', '#FFC107'];
    if (level >= 25) return ['#FF5722', '#FF7043'];
    return ['#F44336', '#E57373'];
  };

  const getRangeRemaining = () => {
    return Math.round((userVehicle.currentBattery / 100) * vehicleModel.range);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderBatterySection = () => (
    <LinearGradient
      colors={getBatteryColor(userVehicle.currentBattery)}
      style={styles.batteryCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.batteryHeader}>
        <Text style={styles.batteryTitle}>Battery Status</Text>
        <TouchableOpacity onPress={() => onEdit(userVehicle)}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.batteryContent}>
        <View style={styles.batteryLevel}>
          <View style={styles.batteryContainer}>
            <View style={[styles.batteryFill, { height: `${userVehicle.currentBattery}%` }]} />
            <Text style={styles.batteryPercentage}>{userVehicle.currentBattery}%</Text>
          </View>
        </View>
        
        <View style={styles.rangeInfo}>
          <Text style={styles.rangeLabel}>Range Remaining</Text>
          <Text style={styles.rangeValue}>{getRangeRemaining()} km</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="flash" size={24} color={Colors.PRIMARY} />
        <Text style={styles.statValue}>
          {chargingStats?.totalKwh || '0'} kWh
        </Text>
        <Text style={styles.statLabel}>Total Energy</Text>
      </View>
      
      <View style={styles.statCard}>
        <Ionicons name="time" size={24} color={Colors.PRIMARY} />
        <Text style={styles.statValue}>
          {chargingStats?.avgSessionTime || '0'} min
        </Text>
        <Text style={styles.statLabel}>Avg Session</Text>
      </View>
      
      <View style={styles.statCard}>
        <Ionicons name="card" size={24} color={Colors.PRIMARY} />
        <Text style={styles.statValue}>
          ₹{chargingStats?.totalCost || '0'}
        </Text>
        <Text style={styles.statLabel}>Total Cost</Text>
      </View>
    </View>
  );

  const renderLastCharge = () => {
    const lastCharge = chargingHistory[0];
    if (!lastCharge) return null;

    return (
      <View style={styles.lastChargeCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Last Charge Session</Text>
          <Text style={styles.cardDate}>{formatDate(lastCharge.date)}</Text>
        </View>
        
        <View style={styles.chargeDetails}>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Location:</Text>
            <Text style={styles.chargeValue}>{lastCharge.stationName}</Text>
          </View>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Energy Added:</Text>
            <Text style={styles.chargeValue}>{lastCharge.kWhAdded} kWh</Text>
          </View>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Cost:</Text>
            <Text style={styles.chargeValue}>{lastCharge.cost}</Text>
          </View>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Duration:</Text>
            <Text style={styles.chargeValue}>{lastCharge.duration}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSmartReminders = () => {
    if (smartReminders.length === 0) return null;

    return (
      <View style={styles.remindersSection}>
        <Text style={styles.sectionTitle}>Smart Reminders</Text>
        {smartReminders.map((reminder, index) => (
          <View key={index} style={[
            styles.reminderCard,
            reminder.priority === 'high' && styles.highPriorityReminder
          ]}>
            <View style={styles.reminderHeader}>
              <Text style={styles.reminderIcon}>{reminder.icon}</Text>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderMessage}>{reminder.message}</Text>
              </View>
              {reminder.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>!</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading vehicle data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderBatterySection()}
      {renderQuickStats()}
      {renderLastCharge()}
      {renderSmartReminders()}
      
      {/* Vehicle Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(userVehicle)}
        >
          <Ionicons name="settings" size={20} color={Colors.PRIMARY} />
          <Text style={styles.actionText}>Edit Vehicle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => onRemove(userVehicle)}
        >
          <Ionicons name="trash" size={20} color="#FF5722" />
          <Text style={[styles.actionText, styles.dangerText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  batteryCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  batteryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  batteryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  batteryLevel: {
    alignItems: 'center',
  },
  batteryContainer: {
    width: 100,
    height: 140,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  batteryFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    minHeight: 10,
  },
  batteryPercentage: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 1,
    textAlign: 'center',
  },
  rangeInfo: {
    alignItems: 'flex-end',
  },
  rangeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
  },
  lastChargeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  cardDate: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  chargeDetails: {
    gap: 8,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chargeLabel: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  chargeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  remindersSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 12,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  highPriorityReminder: {
    borderLeftColor: '#FF5722',
    backgroundColor: '#FFF3F0',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 4,
  },
  reminderMessage: {
    fontSize: 13,
    color: Colors.GRAY,
    lineHeight: 18,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dangerButton: {
    backgroundColor: '#FFF5F5',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginLeft: 8,
  },
  dangerText: {
    color: '#FF5722',
  },
});

export default VehicleDashboard;