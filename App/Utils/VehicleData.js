// Popular EV models with detailed specifications
export const EV_MODELS = {
  'tata-nexon-ev': {
    id: 'tata-nexon-ev',
    name: 'Tata Nexon EV',
    brand: 'Tata',
    batteryCapacity: 30.2, // kWh
    range: 312, // km
    chargingTime: 60, // minutes (0-80%)
    connectorTypes: ['Type 2', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400',
    price: '₹15.99 Lakh',
    topSpeed: 120, // km/h
    acceleration: '9.9 sec (0-100 km/h)',
    gradient: ['#FF6B6B', '#4ECDC4'],
    color: '#FF6B6B'
  },
  'mg-zs-ev': {
    id: 'mg-zs-ev',
    name: 'MG ZS EV',
    brand: 'MG',
    batteryCapacity: 44.5, // kWh
    range: 419, // km
    chargingTime: 50, // minutes (0-80%)
    connectorTypes: ['Type 2', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    price: '₹24.58 Lakh',
    topSpeed: 140, // km/h
    acceleration: '8.5 sec (0-100 km/h)',
    gradient: ['#667eea', '#764ba2'],
    color: '#667eea'
  },
  'hyundai-kona': {
    id: 'hyundai-kona',
    name: 'Hyundai Kona Electric',
    brand: 'Hyundai',
    batteryCapacity: 39.2, // kWh
    range: 452, // km
    chargingTime: 57, // minutes (0-80%)
    connectorTypes: ['Type 2', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1549927681-6ea9c2b5da9e?w=400',
    price: '₹23.84 Lakh',
    topSpeed: 167, // km/h
    acceleration: '9.7 sec (0-100 km/h)',
    gradient: ['#f093fb', '#f5576c'],
    color: '#f093fb'
  },
  'byd-atto-3': {
    id: 'byd-atto-3',
    name: 'BYD Atto 3',
    brand: 'BYD',
    batteryCapacity: 60.48, // kWh
    range: 521, // km
    chargingTime: 50, // minutes (0-80%)
    connectorTypes: ['Type 2', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
    price: '₹33.99 Lakh',
    topSpeed: 160, // km/h
    acceleration: '7.3 sec (0-100 km/h)',
    gradient: ['#4facfe', '#00f2fe'],
    color: '#4facfe'
  },
  'mahindra-xuv400': {
    id: 'mahindra-xuv400',
    name: 'Mahindra XUV400 EV',
    brand: 'Mahindra',
    batteryCapacity: 39.4, // kWh
    range: 456, // km
    chargingTime: 50, // minutes (0-80%)
    connectorTypes: ['Type 2', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
    price: '₹15.49 Lakh',
    topSpeed: 150, // km/h
    acceleration: '8.3 sec (0-100 km/h)',
    gradient: ['#fa709a', '#fee140'],
    color: '#fa709a'
  },
  'tesla-model-3': {
    id: 'tesla-model-3',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    batteryCapacity: 57.5, // kWh
    range: 555, // km
    chargingTime: 30, // minutes (0-80%)
    connectorTypes: ['Tesla', 'CCS'],
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    price: '₹39.99 Lakh',
    topSpeed: 225, // km/h
    acceleration: '5.6 sec (0-100 km/h)',
    gradient: ['#667eea', '#764ba2'],
    color: '#667eea'
  }
};

// Generate sample charging history
export const generateSampleChargingHistory = (vehicleId) => {
  const sessions = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const sessionDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 * Math.random() * 7));
    sessions.push({
      id: `charge-${vehicleId}-${i}`,
      date: sessionDate,
      stationName: `EV Station ${Math.floor(Math.random() * 100) + 1}`,
      location: `Location ${i + 1}`,
      startBattery: Math.floor(Math.random() * 50) + 10, // 10-60%
      endBattery: Math.floor(Math.random() * 40) + 60, // 60-100%
      kWhAdded: (Math.random() * 30 + 5).toFixed(1), // 5-35 kWh
      cost: `₹${(Math.random() * 500 + 100).toFixed(0)}`, // ₹100-600
      duration: `${Math.floor(Math.random() * 90 + 15)} min`, // 15-105 min
      chargingSpeed: ['Rapid', 'Fast', 'Slow'][Math.floor(Math.random() * 3)]
    });
  }
  
  return sessions.sort((a, b) => b.date - a.date); // Most recent first
};

// Smart reminder logic
export const generateSmartReminders = (vehicle, chargingHistory, userPreferences = {}) => {
  const reminders = [];
  const lastCharge = chargingHistory[0];
  const currentBattery = lastCharge ? lastCharge.endBattery : 50;
  const avgDailyDriving = userPreferences.avgDailyKm || 40;
  
  // Low battery reminder
  if (currentBattery < 25) {
    reminders.push({
      type: 'urgent',
      title: 'Low Battery Alert!',
      message: `Your ${vehicle.name} is at ${currentBattery}%. Find a charging station nearby.`,
      icon: '🔋',
      priority: 'high'
    });
  }
  
  // Proactive charging reminder
  if (currentBattery < 60) {
    const rangeLeft = (currentBattery / 100) * vehicle.range;
    const daysUntilEmpty = Math.floor(rangeLeft / avgDailyDriving);
    
    reminders.push({
      type: 'proactive',
      title: 'Plan Your Next Charge',
      message: `With ${daysUntilEmpty} days of driving left, consider charging to 80% tonight.`,
      icon: '⚡',
      priority: 'medium'
    });
  }
  
  // Trip planning reminder
  if (userPreferences.plannedTrip) {
    const tripDistance = userPreferences.plannedTrip.distance;
    const currentRange = (currentBattery / 100) * vehicle.range;
    
    if (currentRange < tripDistance + 50) { // 50km buffer
      reminders.push({
        type: 'trip',
        title: 'Charge Before Your Trip',
        message: `Your ${userPreferences.plannedTrip.destination} trip needs ${tripDistance}km. Charge to 90% for safety.`,
        icon: '🗺️',
        priority: 'high'
      });
    }
  }
  
  // Weather-based reminder
  const isWinter = new Date().getMonth() >= 11 || new Date().getMonth() <= 2;
  if (isWinter && currentBattery < 70) {
    reminders.push({
      type: 'weather',
      title: 'Winter Driving Reminder',
      message: 'Cold weather reduces range by 20%. Keep battery above 70% in winter.',
      icon: '❄️',
      priority: 'medium'
    });
  }
  
  return reminders;
};

export default EV_MODELS;