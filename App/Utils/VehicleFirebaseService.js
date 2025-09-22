import { db } from './FirebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

// Cache for user vehicles to reduce Firebase calls
let vehiclesCache = new Map();
let cacheTimestamp = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// User Vehicle Management
export const VehicleService = {
  // Add user's vehicle
  async addUserVehicle(userId, vehicleData) {
    try {
      const userVehicleRef = collection(db, 'userVehicles');
      const docRef = await addDoc(userVehicleRef, {
        userId: userId,
        vehicleId: vehicleData.id,
        nickname: vehicleData.nickname || vehicleData.name,
        purchaseDate: vehicleData.purchaseDate || new Date(),
        currentBattery: vehicleData.currentBattery || 100,
        totalMileage: vehicleData.totalMileage || 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Invalidate cache after adding
      vehiclesCache.delete(userId);
      cacheTimestamp.delete(userId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  },

  // Get user's vehicles with caching
  async getUserVehicles(userId, forceRefresh = false) {
    try {
      // Check cache first
      const now = Date.now();
      const cachedVehicles = vehiclesCache.get(userId);
      const lastCached = cacheTimestamp.get(userId);
      
      if (!forceRefresh && cachedVehicles && lastCached && (now - lastCached) < CACHE_DURATION) {
        console.log('Returning cached vehicles for user:', userId);
        return cachedVehicles;
      }
      
      console.log('Fetching fresh vehicles from Firebase for user:', userId);
      const q = query(
        collection(db, 'userVehicles'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const vehicles = [];
      querySnapshot.forEach((doc) => {
        vehicles.push({ id: doc.id, ...doc.data() });
      });
      
      // Update cache
      vehiclesCache.set(userId, vehicles);
      cacheTimestamp.set(userId, now);
      
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Clear cache for user (useful for debugging)
  clearCache(userId) {
    if (userId) {
      vehiclesCache.delete(userId);
      cacheTimestamp.delete(userId);
    } else {
      vehiclesCache.clear();
      cacheTimestamp.clear();
    }
  },

  // Update vehicle battery status
  async updateVehicleBattery(userVehicleId, batteryLevel, userId = null) {
    try {
      const vehicleRef = doc(db, 'userVehicles', userVehicleId);
      await updateDoc(vehicleRef, {
        currentBattery: batteryLevel,
        updatedAt: serverTimestamp()
      });
      
      // Clear cache if userId provided
      if (userId) {
        vehiclesCache.delete(userId);
        cacheTimestamp.delete(userId);
      }
    } catch (error) {
      console.error('Error updating battery:', error);
      throw error;
    }
  },

  // Remove vehicle
  async removeVehicle(userVehicleId, userId = null) {
    try {
      const vehicleRef = doc(db, 'userVehicles', userVehicleId);
      await updateDoc(vehicleRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
      
      // Clear cache if userId provided
      if (userId) {
        vehiclesCache.delete(userId);
        cacheTimestamp.delete(userId);
      }
    } catch (error) {
      console.error('Error removing vehicle:', error);
      throw error;
    }
  }
};

// Charging Session Management
export const ChargingService = {
  // Log a charging session
  async logChargingSession(userId, userVehicleId, sessionData) {
    try {
      const chargingRef = collection(db, 'chargingSessions');
      const docRef = await addDoc(chargingRef, {
        userId: userId,
        userVehicleId: userVehicleId,
        stationId: sessionData.stationId,
        stationName: sessionData.stationName,
        location: sessionData.location,
        startTime: sessionData.startTime || new Date(),
        endTime: sessionData.endTime,
        startBattery: sessionData.startBattery,
        endBattery: sessionData.endBattery,
        kWhAdded: sessionData.kWhAdded,
        cost: sessionData.cost,
        chargingSpeed: sessionData.chargingSpeed,
        connectorType: sessionData.connectorType,
        createdAt: serverTimestamp()
      });
      
      // Update vehicle's current battery level
      if (sessionData.endBattery) {
        await VehicleService.updateVehicleBattery(userVehicleId, sessionData.endBattery);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error logging charging session:', error);
      throw error;
    }
  },

  // Get charging history for a vehicle
  async getChargingHistory(userVehicleId, limit = 20) {
    try {
      const q = query(
        collection(db, 'chargingSessions'),
        where('userVehicleId', '==', userVehicleId),
        orderBy('startTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      
      return sessions.slice(0, limit);
    } catch (error) {
      console.error('Error fetching charging history:', error);
      throw error;
    }
  },

  // Get charging stats
  async getChargingStats(userVehicleId) {
    try {
      const sessions = await this.getChargingHistory(userVehicleId, 100);
      
      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          totalKwh: 0,
          totalCost: 0,
          avgSessionTime: 0,
          lastChargeDate: null
        };
      }

      const totalKwh = sessions.reduce((sum, session) => sum + (parseFloat(session.kWhAdded) || 0), 0);
      const totalCost = sessions.reduce((sum, session) => {
        const cost = session.cost?.replace(/[₹,]/g, '') || '0';
        return sum + parseFloat(cost);
      }, 0);

      const sessionsWithDuration = sessions.filter(s => s.endTime && s.startTime);
      const avgSessionTime = sessionsWithDuration.length > 0 
        ? sessionsWithDuration.reduce((sum, session) => {
            const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60); // minutes
            return sum + duration;
          }, 0) / sessionsWithDuration.length
        : 0;

      return {
        totalSessions: sessions.length,
        totalKwh: totalKwh.toFixed(1),
        totalCost: Math.round(totalCost),
        avgSessionTime: Math.round(avgSessionTime),
        lastChargeDate: sessions[0]?.startTime
      };
    } catch (error) {
      console.error('Error calculating charging stats:', error);
      throw error;
    }
  }
};

// User Preferences Management
export const UserPreferencesService = {
  // Save user driving preferences
  async saveUserPreferences(userId, preferences) {
    try {
      const preferencesRef = collection(db, 'userPreferences');
      const q = query(preferencesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Create new preferences
        await addDoc(preferencesRef, {
          userId: userId,
          ...preferences,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Update existing preferences
        const docRef = doc(db, 'userPreferences', querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          ...preferences,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  },

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const q = query(
        collection(db, 'userPreferences'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      
      // Return default preferences
      return {
        avgDailyKm: 40,
        preferredChargingTime: 'night',
        reminderSettings: {
          lowBattery: true,
          proactive: true,
          weather: true,
          trip: true
        },
        chargingGoal: 80 // Default charge to 80%
      };
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }
};

export default { VehicleService, ChargingService, UserPreferencesService };