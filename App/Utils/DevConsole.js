// Development console utilities
// This file helps manage console output in development

export const devLog = {
  // Enhanced logging with categories
  info: (category, message, ...args) => {
    if (__DEV__) {
      console.log(`ℹ️ [${category}]`, message, ...args);
    }
  },
  
  success: (category, message, ...args) => {
    if (__DEV__) {
      console.log(`✅ [${category}]`, message, ...args);
    }
  },
  
  error: (category, message, ...args) => {
    if (__DEV__) {
      console.error(`❌ [${category}]`, message, ...args);
    }
  },
  
  warning: (category, message, ...args) => {
    if (__DEV__) {
      console.warn(`⚠️ [${category}]`, message, ...args);
    }
  },
  
  // Vehicle management logs
  vehicle: (message, ...args) => {
    if (__DEV__) {
      console.log(`🚗 [VEHICLE]`, message, ...args);
    }
  },
  
  // Firebase logs
  firebase: (message, ...args) => {
    if (__DEV__) {
      console.log(`🔥 [FIREBASE]`, message, ...args);
    }
  },
  
  // Map/Location logs
  location: (message, ...args) => {
    if (__DEV__) {
      console.log(`📍 [LOCATION]`, message, ...args);
    }
  },
  
  // API logs
  api: (message, ...args) => {
    if (__DEV__) {
      console.log(`🌐 [API]`, message, ...args);
    }
  }
};

// Suppress Firebase warnings globally
export const suppressFirebaseWarnings = () => {
  if (__DEV__) {
    const originalWarn = console.warn;
    
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Comprehensive Firebase warning filtering
      const firebaseWarnings = [
        '@firebase/firestore',
        'WebChannelConnection',
        'RPC',
        'transport errored',
        'stream',
        'Firestore (10.14.1)',
        'WebChannel',
        'firebase',
        'Firestore'
      ];
      
      const shouldSuppress = firebaseWarnings.some(warning => 
        message.toLowerCase().includes(warning.toLowerCase())
      );
      
      if (!shouldSuppress) {
        originalWarn.apply(console, args);
      }
    };
  }
};

// Initialize console filtering
suppressFirebaseWarnings();