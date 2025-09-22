import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import LoginScreen from './App/Screen/LoginScreen/LoginScreen';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import * as SecureStore from "expo-secure-store";
import { NavigationContainer, TabRouter } from '@react-navigation/native';
import TabNavigation from './App/Navigations/TabNavigation';
import * as Location from 'expo-location';
import { UserLocationContext } from './App/Context/UserLocationContext';
import './polyfills/crypto';
import './App/Utils/DevConsole'; // Initialize console filtering

// Suppress console warnings and undefined logs in development
if (__DEV__) {
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Filter out Firebase and other unwanted warnings
    if (
      message.includes('@firebase/firestore') ||
      message.includes('WebChannelConnection') ||
      message.includes('RPC') ||
      message.includes('transport errored') ||
      message.includes('stream') ||
      message.includes('Firestore (10.14.1)') ||
      message.includes('WebChannel')
    ) {
      return; // Don't log these warnings
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  console.log = (...args) => {
    // Filter out undefined logs
    if (args.length === 1 && args[0] === undefined) {
      return; // Don't log undefined values
    }
    
    originalConsoleLog.apply(console, args);
  };
}



SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};



export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setAppIsReady(true);
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <ClerkProvider
     tokenCache={tokenCache}
     publishableKey={'pk_test_ZmFtb3VzLWNvbHQtNDcuY2xlcmsuYWNjb3VudHMuZGV2JA'}
    >
      <UserLocationContext.Provider value={{location,setLocation}}>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <SignedIn>
            <NavigationContainer>
              <TabNavigation />
            </NavigationContainer>
          </SignedIn>

          <SignedOut>
            <LoginScreen/>
          </SignedOut>
          
          <StatusBar style="auto" />
        </View>
      </UserLocationContext.Provider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
});
